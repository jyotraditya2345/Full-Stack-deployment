import type { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: 'asc' | 'desc';
  assignedToId?: string;
  creatorId?: string;
}

export class TaskRepository {
  static createTask(data: Prisma.TaskCreateInput) {
    return prisma.task.create({ data });
  }

  static updateTask(id: string, data: Prisma.TaskUpdateInput) {
    return prisma.task.update({ where: { id }, data });
  }

  static deleteTask(id: string) {
    return prisma.task.delete({ where: { id } });
  }

  static findById(id: string) {
    return prisma.task.findUnique({
      where: { id },
      include: { assignee: true, creator: true }
    });
  }

  static listTasks(filters: TaskFilters) {
    const where: Prisma.TaskWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.creatorId) where.creatorId = filters.creatorId;

    return prisma.task.findMany({
      where,
      orderBy: { dueDate: filters.sort === 'desc' ? 'desc' : 'asc' }
    });
  }

  static listDashboardTasks(userId: string) {
    const now = new Date();

    return prisma.$transaction([
      prisma.task.findMany({
        where: { assignedToId: userId },
        orderBy: { dueDate: 'asc' }
      }),
      prisma.task.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.findMany({
        where: {
          assignedToId: userId,
          dueDate: { lt: now },
          status: { not: 'COMPLETED' }
        },
        orderBy: { dueDate: 'asc' }
      })
    ]);
  }
}
