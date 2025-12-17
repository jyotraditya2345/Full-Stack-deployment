import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyJwt } from '../utils/jwt';

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(new UnauthorizedError('Authentication required'));
  }

  try {
    const payload = verifyJwt(token);
    req.user = { id: payload.userId, email: payload.email, name: payload.name };
    return next();
  } catch (_err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
};
