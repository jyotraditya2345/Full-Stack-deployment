import { prisma } from '../config/prisma';

export class TaskAuditRepository {
  static createEntry(params: { taskId: string; userId: string; action: string }) {
    return prisma.taskAudit.create({ data: params });
  }
}
