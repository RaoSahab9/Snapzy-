const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const router = express.Router();
const Project = require('../models/Project');

// GET /api/download/:projectId - Download generated project
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Find project in database
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if project is completed
    if (project.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Project generation not completed yet'
      });
    }

    // Check if zip file exists
    if (!project.filePath || !(await fs.pathExists(project.filePath))) {
      return res.status(404).json({
        success: false,
        error: 'Project file not found (may have expired)'
      });
    }

    // Set download headers
    const fileName = `${project.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${projectId.slice(0, 8)}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', project.metadata?.zipSize || 0);

    // Stream the file
    const fileStream = fs.createReadStream(project.filePath);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Error reading project file'
        });
      }
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download project'
    });
  }
});

// GET /api/download/:projectId/info - Get download info without downloading
router.get('/:projectId/info', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    const fileExists = project.filePath && (await fs.pathExists(project.filePath));

    res.json({
      success: true,
      download: {
        projectId: project.projectId,
        projectName: project.projectName,
        status: project.status,
        fileExists,
        zipSize: project.metadata?.zipSize || 0,
        totalFiles: project.metadata?.totalFiles || 0,
        createdAt: project.createdAt,
        expiresAt: project.expiresAt
      }
    });

  } catch (error) {
    console.error('Download info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get download info'
    });
  }
});

module.exports = router;