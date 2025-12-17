import type { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notificationService';

export class NotificationController {
  /**
   * List notifications for the authenticated user.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.listForUser(req.user!.id);
      res.json({ notifications });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Mark a notification as read for the authenticated user.
   */
  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.markRead(req.params.id, req.user!.id);
      res.json({ notification });
    } catch (err) {
      next(err);
    }
  }
}
