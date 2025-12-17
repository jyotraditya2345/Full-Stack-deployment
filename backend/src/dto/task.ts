import { z } from 'zod';

export const taskStatusValues = ['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as const;
export const taskPriorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

const baseTaskSchema = {
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  priority: z.enum(taskPriorityValues).default('MEDIUM'),
  status: z.enum(taskStatusValues).default('TO_DO'),
  assignedToId: z.string().uuid().optional().nullable()
};

export const createTaskSchema = z.object({
  ...baseTaskSchema
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(taskPriorityValues).optional(),
    status: z.enum(taskStatusValues).optional(),
    assignedToId: z.string().uuid().nullable().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update payload cannot be empty'
  });

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
