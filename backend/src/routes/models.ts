import { Router } from 'express';
import {
  getAvailableModels,
  testModelConnection,
  getModelInfo,
} from '@/controllers/modelController';

const router = Router();

// GET /api/models
router.get('/', getAvailableModels);

// GET /api/models/:modelId
router.get('/:modelId', getModelInfo);

// POST /api/models/:modelId/test
router.post('/:modelId/test', testModelConnection);

export default router;