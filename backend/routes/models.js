const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// GET /api/models - Get available AI models
router.get('/', (req, res) => {
  try {
    const models = aiService.getAvailableModels();
    
    // Check which models are actually available based on API keys
    const availableModels = models.map(model => ({
      ...model,
      available: model.requiresKey ? !!process.env[model.requiresKey] : true
    }));

    res.json({
      success: true,
      models: availableModels,
      count: availableModels.length
    });
  } catch (error) {
    console.error('Models fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available models'
    });
  }
});

// GET /api/models/status - Check API key status for each provider
router.get('/status', (req, res) => {
  try {
    const status = {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      google: !!process.env.GOOGLE_API_KEY,
      mistral: !!process.env.MISTRAL_API_KEY,
      replicate: !!process.env.REPLICATE_API_TOKEN,
      ollama: !!process.env.OLLAMA_BASE_URL,
      lmStudio: !!process.env.LM_STUDIO_BASE_URL
    };

    res.json({
      success: true,
      status,
      configured: Object.values(status).filter(Boolean).length,
      total: Object.keys(status).length
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check model status'
    });
  }
});

module.exports = router;