const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const aiService = require('../services/aiService');
const projectGenerator = require('../services/projectGenerator');
const Project = require('../models/Project');
const rateLimiter = require('../middleware/rateLimiter');

// Validation schema
const generateSchema = Joi.object({
  prompt: Joi.string().min(10).max(2000).required(),
  aiModel: Joi.string().valid(
    'openai-gpt4', 'openai-gpt4o', 'claude-3-sonnet', 'claude-3-haiku', 
    'gemini-pro', 'llama3', 'mistral', 'ollama', 'lm-studio'
  ).required(),
  options: Joi.object({
    includeTests: Joi.boolean().default(true),
    includeDocker: Joi.boolean().default(false),
    includeCICD: Joi.boolean().default(false),
    framework: Joi.string().optional()
  }).optional()
});

// GET /api/generate/templates - Get project templates
router.get('/templates', (req, res) => {
  try {
    const templates = projectGenerator.getProjectTemplates();
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch templates'
    });
  }
});

// POST /api/generate - Generate project
router.post('/', rateLimiter.generation, async (req, res) => {
  try {
    // Validate request
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { prompt, aiModel, options = {} } = value;
    const projectId = uuidv4();

    // Create project record in database
    const project = new Project({
      projectId,
      prompt,
      aiModel,
      projectName: `Generated Project ${Date.now()}`,
      status: 'generating'
    });

    await project.save();

    // Send immediate response with project ID
    res.status(202).json({
      success: true,
      message: 'Project generation started',
      projectId,
      estimatedTime: '2-5 minutes'
    });

    // Generate project asynchronously
    generateProjectAsync(project, prompt, aiModel, options);

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start project generation'
    });
  }
});

// GET /api/generate/status/:projectId - Check generation status
router.get('/status/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project: {
        projectId: project.projectId,
        status: project.status,
        projectName: project.projectName,
        prompt: project.prompt,
        aiModel: project.aiModel,
        techStack: project.techStack,
        metadata: project.metadata,
        errorMessage: project.errorMessage,
        createdAt: project.createdAt,
        expiresAt: project.expiresAt
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check project status'
    });
  }
});

// GET /api/generate/files/:projectId - Get project file structure
router.get('/files/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    if (project.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Project generation not completed'
      });
    }

    res.json({
      success: true,
      fileStructure: project.fileStructure
    });

  } catch (error) {
    console.error('File structure error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch file structure'
    });
  }
});

// Async function to generate project
async function generateProjectAsync(project, prompt, aiModel, options) {
  const startTime = Date.now();
  
  try {
    // Generate project with AI
    console.log(`🤖 Generating project ${project.projectId} with ${aiModel}`);
    const projectData = await aiService.generateProject(prompt, aiModel);

    // Update project with generated data
    project.projectName = projectData.projectName || project.projectName;
    project.projectDescription = projectData.description;
    project.techStack = projectData.techStack;

    // Create project files
    console.log(`📁 Creating files for project ${project.projectId}`);
    const result = await projectGenerator.createProjectFiles(projectData, project.projectId);

    // Update project with results
    project.status = result.validation.isValid ? 'completed' : 'failed';
    project.filePath = result.zipPath;
    project.fileStructure = result.validation.structure;
    project.metadata = {
      generationTime: Date.now() - startTime,
      ...result.metadata
    };

    if (!result.validation.isValid) {
      project.errorMessage = result.validation.errors.join(', ');
    }

    await project.save();

    console.log(`✅ Project ${project.projectId} generation completed in ${project.metadata.generationTime}ms`);

  } catch (error) {
    console.error(`❌ Project ${project.projectId} generation failed:`, error);
    
    project.status = 'failed';
    project.errorMessage = error.message;
    project.metadata = {
      generationTime: Date.now() - startTime
    };
    
    await project.save();
  }
}

module.exports = router;