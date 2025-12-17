import type { Prisma, TaskPriority, TaskStatus } from '@prisma/client';
import { TaskRepository } from '../repositories/taskRepository';
import { UserRepository } from '../repositories/userRepository';
import { NotificationRepository } from '../repositories/notificationRepository';
import { TaskAuditRepository } from '../repositories/taskAuditRepository';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/errors';
import { socketService } from '../sockets/socketService';
import type { CreateTaskDto, UpdateTaskDto } from '../dto/task';

export class TaskService {
  static async list(filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    sort?: 'asc' | 'desc';
    assignedToId?: string;
    creatorId?: string;
  }) {
    return TaskRepository.listTasks(filters);
  }

  static async getById(id: string) {
    const task = await TaskRepository.findById(id);
    if (!task) throw new NotFoundError('Task not found');
    return task;
  }

  static async create(payload: CreateTaskDto, creatorId: string) {
    if (payload.assignedToId) {
      const assignee = await UserRepository.findById(payload.assignedToId);
      if (!assignee) throw new ValidationError('Assignee does not exist');
    }

    const data: Prisma.TaskCreateInput = {
      title: payload.title,
      description: payload.description,
      dueDate: new Date(payload.dueDate),
      priority: payload.priority,
      status: payload.status,
      creator: { connect: { id: creatorId } }
    };

    if (payload.assignedToId) {
      data.assignee = { connect: { id: payload.assignedToId } };
    }

    const task = await TaskRepository.createTask(data);
    await TaskAuditRepository.createEntry({ taskId: task.id, userId: creatorId, action: 'CREATED' });
    socketService.emitTaskUpdated(task);

    if (payload.assignedToId && payload.assignedToId !== creatorId) {
      const notification = await NotificationRepository.createNotification({
        userId: payload.assignedToId,
        taskId: task.id,
        message: `You have been assigned to "${task.title}".`
      });
      socketService.emitTaskAssigned(payload.assignedToId, { task, notification });
    }

    return task;
  }

  static async update(id: string, payload: UpdateTaskDto, actorId: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError('Task not found');

    if (existing.creatorId !== actorId && existing.assignedToId !== actorId) {
      throw new ForbiddenError('Only the creator or assignee can update this task');
    }

    if (payload.assignedToId) {
      const assignee = await UserRepository.findById(payload.assignedToId);
      if (!assignee) throw new ValidationError('Assignee does not exist');
    }

    const data: Prisma.TaskUpdateInput = {};
    if (payload.title) data.title = payload.title;
    if (payload.description) data.description = payload.description;
    if (payload.dueDate) data.dueDate = new Date(payload.dueDate);
    if (payload.priority) data.priority = payload.priority;
    if (payload.status) data.status = payload.status;
    if (payload.assignedToId !== undefined) {
      if (payload.assignedToId === null) {
        data.assignee = { disconnect: true };
      } else {
        data.assignee = { connect: { id: payload.assignedToId } };
      }
    }

    const updated = await TaskRepository.updateTask(id, data);
    const changedFields = Object.keys(payload).join(',');
    await TaskAuditRepository.createEntry({
      taskId: id,
      userId: actorId,
      action: `UPDATED:${changedFields || 'NONE'}`
    });

    if (payload.assignedToId && payload.assignedToId !== existing.assignedToId) {
      const notification = await NotificationRepository.createNotification({
        userId: payload.assignedToId,
        taskId: id,
        message: `A task has been assigned to you: "${updated.title}".`
      });
      socketService.emitTaskAssigned(payload.assignedToId, { task: updated, notification });
    }

    socketService.emitTaskUpdated(updated);
    return updated;
  }

  static async delete(id: string, actorId: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) throw new NotFoundError('Task not found');
    if (existing.creatorId !== actorId) throw new ForbiddenError('Only the creator can delete this task');

    await TaskRepository.deleteTask(id);
    await TaskAuditRepository.createEntry({ taskId: id, userId: actorId, action: 'DELETED' });
    socketService.emitTaskUpdated(existing);
  }

  static async dashboard(userId: string) {
    const [assigned, created, overdue] = await TaskRepository.listDashboardTasks(userId);
    return { assigned, created, overdue };
  }
}
