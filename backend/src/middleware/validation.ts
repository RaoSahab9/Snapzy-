import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { APIResponse } from '@/types';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response<APIResponse>, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errorMessages,
    });
  };
};

export const handleValidationErrors = (
  req: Request,
  res: Response<APIResponse>,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errorMessages,
    });
    return;
  }
  next();
};