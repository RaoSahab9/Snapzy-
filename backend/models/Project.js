const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    unique: true
  },
  prompt: {
    type: String,
    required: true,
    maxLength: 2000
  },
  aiModel: {
    type: String,
    required: true,
    enum: ['openai-gpt4', 'openai-gpt4o', 'claude-3-sonnet', 'claude-3-haiku', 'gemini-pro', 'llama3', 'mistral', 'ollama', 'lm-studio']
  },
  projectName: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String
  },
  techStack: {
    frontend: String,
    backend: String,
    database: String,
    deployment: String
  },
  fileStructure: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  filePath: {
    type: String // Path to the generated zip file
  },
  errorMessage: {
    type: String
  },
  metadata: {
    generationTime: Number, // in milliseconds
    totalFiles: Number,
    totalLines: Number,
    zipSize: Number // in bytes
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from creation
  }
});

// Create index for automatic cleanup of expired projects
projectSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Project', projectSchema);