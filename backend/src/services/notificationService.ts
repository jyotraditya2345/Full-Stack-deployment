import { NotificationRepository } from '../repositories/notificationRepository';
import { NotFoundError } from '../utils/errors';

export class NotificationService {
  static listForUser(userId: string) {
    return NotificationRepository.listForUser(userId);
  }

  static async markRead(id: string, userId: string) {
    const existing = await NotificationRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError('Notification not found');
    }
    return NotificationRepository.markRead(id);
  }
}
