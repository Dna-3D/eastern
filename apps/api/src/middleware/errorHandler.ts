// ============================================================
// Global Error Handler Middleware
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors,
    });
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Unexpected errors
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}