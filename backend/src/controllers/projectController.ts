import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '@/types';
import { Project } from '@/models/Project';
import { AIServiceManager } from '@/services/ai/AIServiceManager';
import { ProjectFile } from '@/types';
import { createProjectZip } from '@/utils/fileUtils';

const aiServiceManager = new AIServiceManager();

export const generateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { prompt, aiModel, framework, backend, database, features } = req.body;

    // Create project record
    const project = new Project({
      userId: req.user._id,
      title: `Project ${Date.now()}`, // Will be updated after generation
      description: prompt.substring(0, 100) + '...',
      prompt,
      aiModel,
      status: 'generating',
      metadata: {
        framework: framework || 'react',
        backend: backend || 'nodejs',
        database: database || 'mongodb',
        features: features || [],
        estimatedTime: '1-2 hours',
        complexity: 'medium',
      },
    });

    await project.save();

    // Start generation in background
    generateProjectInBackground(project._id.toString(), {
      prompt,
      aiModel,
      framework,
      backend,
      database,
      features,
    });

    res.status(202).json({
      success: true,
      message: 'Project generation started',
      data: {
        projectId: project._id,
        status: 'generating',
      },
    });
  } catch (error) {
    console.error('Project generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

async function generateProjectInBackground(
  projectId: string,
  request: any
): Promise<void> {
  try {
    const project = await Project.findById(projectId);
    if (!project) return;

    // Update status to generating
    project.status = 'generating';
    await project.save();

    // Generate code using AI
    const response = await aiServiceManager.generateCode(request);

    if (!response.success) {
      project.status = 'failed';
      project.error = response.error;
      await project.save();
      return;
    }

    // Update project with generated files
    project.files = response.files || [];
    project.status = 'completed';
    project.title = `Generated Project - ${new Date().toLocaleDateString()}`;
    
    if (response.files && response.files.length > 0) {
      // Extract metadata from the first few files
      const readmeFile = response.files.find((file: ProjectFile) => 
        file.path.toLowerCase().includes('readme')
      );
      
      if (readmeFile) {
        project.description = readmeFile.content.substring(0, 200) + '...';
      }
    }

    await project.save();
  } catch (error) {
    console.error('Background generation error:', error);
    
    const project = await Project.findById(projectId);
    if (project) {
      project.status = 'failed';
      project.error = error instanceof Error ? error.message : 'Unknown error';
      await project.save();
    }
  }
}

export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-files'); // Don't include file content in list

    const total = await Project.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const downloadProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    if (project.status !== 'completed') {
      res.status(400).json({
        success: false,
        error: 'Project is not ready for download',
      });
      return;
    }

    // Create ZIP file
    const zipBuffer = await createProjectZip(project.files, project.title);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.title}.zip"`);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Download project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Validation schemas
export const generateProjectValidation = [
  body('prompt')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Prompt must be between 10 and 2000 characters'),
  body('aiModel')
    .isIn(['openai', 'claude', 'gemini', 'llama', 'mistral', 'ollama', 'lmstudio'])
    .withMessage('Invalid AI model selected'),
  body('framework')
    .optional()
    .isIn(['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxtjs'])
    .withMessage('Invalid framework selected'),
  body('backend')
    .optional()
    .isIn(['nodejs', 'python', 'go', 'rust', 'java', 'csharp'])
    .withMessage('Invalid backend selected'),
  body('database')
    .optional()
    .isIn(['mongodb', 'postgresql', 'mysql', 'sqlite'])
    .withMessage('Invalid database selected'),
];