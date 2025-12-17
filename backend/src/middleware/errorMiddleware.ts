import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/errors';

// Centralized error handler to keep controllers lean
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const isHttpError = err instanceof HttpError;
  const status = isHttpError ? err.statusCode : 500;
  const payload: Record<string, unknown> = {
    message: err.message || 'Internal Server Error'
  };

  if (isHttpError && err.details) {
    payload.details = err.details;
  }

  if (!isHttpError) {
    // Helpful server-side signal without leaking details to clients
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json(payload);
};
