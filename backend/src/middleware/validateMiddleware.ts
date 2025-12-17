import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate =
  (schema: ZodSchema, property: 'body' | 'query' = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = property === 'body' ? req.body : req.query;
    const result = schema.safeParse(data);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      return next(new ValidationError(message, result.error.flatten()));
    }
    // eslint-disable-next-line no-param-reassign
    (req as any)[property] = result.data;
    return next();
  };
