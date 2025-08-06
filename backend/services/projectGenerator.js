const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');

class ProjectGenerator {
  constructor() {
    this.tempDir = process.env.TEMP_DIR || './temp';
  }

  async createProjectFiles(projectData, projectId) {
    const projectPath = path.join(this.tempDir, projectId);
    
    try {
      // Ensure project directory exists
      await fs.ensureDir(projectPath);

      // Write all files
      const fileStats = await this.writeProjectFiles(projectPath, projectData.files);

      // Validate project structure
      const validation = await this.validateProject(projectPath, projectData);

      // Create zip file
      const zipPath = await this.createZipFile(projectPath, projectId);

      return {
        projectPath,
        zipPath,
        validation,
        metadata: {
          totalFiles: fileStats.totalFiles,
          totalLines: fileStats.totalLines,
          zipSize: (await fs.stat(zipPath)).size
        }
      };
    } catch (error) {
      // Clean up on error
      await this.cleanupProject(projectPath);
      throw error;
    }
  }

  async writeProjectFiles(projectPath, files) {
    let totalFiles = 0;
    let totalLines = 0;

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(projectPath, filePath);
      
      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));
      
      // Write file
      await fs.writeFile(fullPath, content, 'utf8');
      
      totalFiles++;
      totalLines += content.split('\n').length;
    }

    return { totalFiles, totalLines };
  }

  async validateProject(projectPath, projectData) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      structure: {}
    };

    try {
      // Check for required files
      const requiredFiles = this.getRequiredFiles(projectData.techStack);
      
      for (const file of requiredFiles) {
        const filePath = path.join(projectPath, file);
        if (!(await fs.pathExists(filePath))) {
          validation.errors.push(`Missing required file: ${file}`);
          validation.isValid = false;
        }
      }

      // Validate package.json files
      await this.validatePackageJson(projectPath, validation);

      // Check for common issues
      await this.checkCommonIssues(projectPath, validation);

      // Validate file structure
      validation.structure = await this.analyzeFileStructure(projectPath);

    } catch (error) {
      validation.errors.push(`Validation error: ${error.message}`);
      validation.isValid = false;
    }

    return validation;
  }

  getRequiredFiles(techStack) {
    const required = ['README.md'];

    // Frontend requirements
    if (techStack.frontend === 'react') {
      required.push('frontend/package.json', 'frontend/src/App.js');
    } else if (techStack.frontend === 'vue') {
      required.push('frontend/package.json', 'frontend/src/App.vue');
    } else if (techStack.frontend === 'angular') {
      required.push('frontend/package.json', 'frontend/src/app/app.component.ts');
    }

    // Backend requirements
    if (techStack.backend === 'nodejs') {
      required.push('backend/package.json', 'backend/server.js');
    } else if (techStack.backend === 'python') {
      required.push('backend/requirements.txt', 'backend/app.py');
    } else if (techStack.backend === 'php') {
      required.push('backend/composer.json', 'backend/index.php');
    }

    return required;
  }

  async validatePackageJson(projectPath, validation) {
    const packageJsonPaths = [
      'package.json',
      'frontend/package.json',
      'backend/package.json'
    ];

    for (const pkgPath of packageJsonPaths) {
      const fullPath = path.join(projectPath, pkgPath);
      
      if (await fs.pathExists(fullPath)) {
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          JSON.parse(content); // Validate JSON syntax
        } catch (error) {
          validation.errors.push(`Invalid JSON in ${pkgPath}: ${error.message}`);
          validation.isValid = false;
        }
      }
    }
  }

  async checkCommonIssues(projectPath, validation) {
    // Check for placeholder content
    const files = await this.getAllFiles(projectPath);
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      
      // Check for common placeholders
      const placeholders = [
        'TODO:', 'FIXME:', '// Add more logic here',
        'placeholder', 'your_api_key_here'
      ];
      
      for (const placeholder of placeholders) {
        if (content.includes(placeholder)) {
          validation.warnings.push(`Placeholder found in ${path.relative(projectPath, file)}: ${placeholder}`);
        }
      }
    }
  }

  async getAllFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async analyzeFileStructure(projectPath) {
    const structure = {};
    
    const analyzeDir = async (dirPath, relativePath = '') => {
      const items = await fs.readdir(dirPath);
      const result = {};
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);
        const itemRelativePath = path.join(relativePath, item);
        
        if (stat.isDirectory()) {
          result[item] = await analyzeDir(fullPath, itemRelativePath);
        } else {
          result[item] = {
            type: 'file',
            size: stat.size,
            extension: path.extname(item)
          };
        }
      }
      
      return result;
    };
    
    return await analyzeDir(projectPath);
  }

  async createZipFile(projectPath, projectId) {
    const zipPath = path.join(this.tempDir, `${projectId}.zip`);
    
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      output.on('close', () => {
        resolve(zipPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.directory(projectPath, false);
      archive.finalize();
    });
  }

  async cleanupProject(projectPath) {
    try {
      if (await fs.pathExists(projectPath)) {
        await fs.remove(projectPath);
      }
    } catch (error) {
      console.error('Error cleaning up project:', error);
    }
  }

  async cleanupExpiredProjects() {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stat = await fs.stat(filePath);
        
        if (now - stat.mtime.getTime() > maxAge) {
          await fs.remove(filePath);
          console.log(`Cleaned up expired file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Enhanced project templates for better generation
  getProjectTemplates() {
    return {
      'blog': {
        description: 'A full-featured blog with user authentication',
        prompt: 'Create a blog website with user registration, login, post creation, editing, commenting system, and admin panel',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'mongodb'
        }
      },
      'ecommerce': {
        description: 'E-commerce store with shopping cart',
        prompt: 'Create an e-commerce website with product catalog, shopping cart, user accounts, payment processing, and order management',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'mongodb'
        }
      },
      'todo': {
        description: 'Task management application',
        prompt: 'Create a todo/task management app with user authentication, task creation, editing, categories, due dates, and sharing',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'mongodb'
        }
      },
      'social': {
        description: 'Social media platform',
        prompt: 'Create a social media platform with user profiles, posts, likes, comments, following system, and real-time messaging',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'mongodb'
        }
      },
      'dashboard': {
        description: 'Analytics dashboard',
        prompt: 'Create an analytics dashboard with charts, data visualization, user management, and real-time updates',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'mongodb'
        }
      }
    };
  }
}

module.exports = new ProjectGenerator();