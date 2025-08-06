import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation,
} from '@/controllers/authController';
import { validate } from '@/middleware/validation';
import { loginLimiter, registerLimiter } from '@/middleware/rateLimit';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  registerLimiter,
  validate(registerValidation),
  register
);

// POST /api/auth/login
router.post(
  '/login',
  loginLimiter,
  validate(loginValidation),
  login
);

// GET /api/auth/profile
router.get('/profile', getProfile);

export default router;