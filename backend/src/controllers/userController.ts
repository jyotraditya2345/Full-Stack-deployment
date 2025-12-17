import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { toSafeUser } from '../utils/transform';

export class UserController {
  /**
   * Fetch profile for the authenticated user.
   */
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getProfile(req.user!.id);
      res.json({ user: toSafeUser(user) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update the authenticated user's profile (name).
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateProfile(req.user!.id, req.body);
      res.json({ user: toSafeUser(updated) });
    } catch (err) {
      next(err);
    }
  }

  /**
   * List users for assignment (id/name/email only).
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.listUsers();
      res.json({ users: users.map(toSafeUser) });
    } catch (err) {
      next(err);
    }
  }
}
