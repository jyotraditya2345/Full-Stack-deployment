import { prisma } from '../config/prisma';

export class NotificationRepository {
  static createNotification(params: { userId: string; taskId?: string; message: string }) {
    return prisma.notification.create({ data: params });
  }

  static listForUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  static markRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { read: true } });
  }
}
