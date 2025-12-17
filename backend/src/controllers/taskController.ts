import type { Request, Response, NextFunction } from 'express';
import type { TaskPriority, TaskStatus } from '@prisma/client';
import { TaskService } from '../services/taskService';

const parseEnum = <T extends string>(value: unknown, allowed: readonly T[]): T | undefined =>
  allowed.includes(value as T) ? (value as T) : undefined;

export class TaskController {
  /**
   * List tasks with optional filters for status/priority/sort/assignee/creator.
   */
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, priority, sort, assignedToId, creatorId } = req.query;
      const tasks = await TaskService.list({
        status: parseEnum<TaskStatus>(status, ['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
        priority: parseEnum<TaskPriority>(priority, ['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
        sort: parseEnum<'asc' | 'desc'>(sort, ['asc', 'desc']),
        assignedToId: typeof assignedToId === 'string' ? assignedToId : undefined,
        creatorId: typeof creatorId === 'string' ? creatorId : undefined
      });
      res.json({ tasks });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Fetch a single task by id.
   */
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.getById(req.params.id);
      res.json({ task });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a task for the authenticated user and emit real-time updates.
   */
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.create(req.body, req.user!.id);
      res.status(201).json({ task });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a task (creator or assignee only) and emit notifications if reassigned.
   */
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.update(req.params.id, req.body, req.user!.id);
      res.json({ task });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a task (creator only).
   */
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await TaskService.delete(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * Return dashboard bundles for the authenticated user (assigned, created, overdue).
   */
  static async dashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TaskService.dashboard(req.user!.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}
