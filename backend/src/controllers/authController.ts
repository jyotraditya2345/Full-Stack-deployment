import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { env } from '../config/env';
import { toSafeUser } from '../utils/transform';

const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.cookieSecure,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export class AuthController {
  /**
   * Register a new user, set session cookie, and return safe user info.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.register(req.body);
      setAuthCookie(res, token);
      res.status(201).json({ user: toSafeUser(user) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Log in existing user, set session cookie, and return safe user info.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, token } = await AuthService.login(req.body);
      setAuthCookie(res, token);
      res.json({ user: toSafeUser(user) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Return authenticated user from cookie-based session.
   */
  static me(req: Request, res: Response) {
    res.json({ user: req.user });
  }

  /**
   * Clear auth cookie and end session.
   */
  static logout(_req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.cookieSecure
    });
    res.status(204).send();
  }
}
