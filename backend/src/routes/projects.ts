import { Router } from 'express';
import {
  generateProject,
  getProjects,
  getProject,
  downloadProject,
  deleteProject,
  generateProjectValidation,
} from '@/controllers/projectController';
import { validate } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { generationLimiter } from '@/middleware/rateLimit';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/projects/generate
router.post(
  '/generate',
  generationLimiter,
  validate(generateProjectValidation),
  generateProject
);

// GET /api/projects
router.get('/', getProjects);

// GET /api/projects/:id
router.get('/:id', getProject);

// GET /api/projects/:id/download
router.get('/:id/download', downloadProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

export default router;