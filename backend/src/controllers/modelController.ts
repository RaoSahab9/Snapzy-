import { Request, Response } from 'express';
import { AuthRequest } from '@/types';
import { AIServiceManager } from '@/services/ai/AIServiceManager';

const aiServiceManager = new AIServiceManager();

export const getAvailableModels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const models = await aiServiceManager.getAvailableModels();

    res.status(200).json({
      success: true,
      data: models,
    });
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const testModelConnection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { modelId } = req.params;

    if (!modelId) {
      res.status(400).json({
        success: false,
        error: 'Model ID is required',
      });
      return;
    }

    const isConnected = await aiServiceManager.testModelConnection(modelId);

    res.status(200).json({
      success: true,
      data: {
        modelId,
        isConnected,
        message: isConnected ? 'Connection successful' : 'Connection failed',
      },
    });
  } catch (error) {
    console.error('Test model connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getModelInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { modelId } = req.params;

    if (!modelId) {
      res.status(400).json({
        success: false,
        error: 'Model ID is required',
      });
      return;
    }

    const models = await aiServiceManager.getAvailableModels();
    const model = models.find(m => m.id === modelId);

    if (!model) {
      res.status(404).json({
        success: false,
        error: 'Model not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: model,
    });
  } catch (error) {
    console.error('Get model info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};