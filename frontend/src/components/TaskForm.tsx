import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useTaskMutations } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  dueDate: z.string().min(1),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),
  assignedToId: z.string().uuid().optional().nullable()
});

type FormData = z.infer<typeof schema>;

const toLocalInput = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

interface Props {
  initialTask?: Task | null;
  onSuccess?: () => void;
}

export const TaskForm: React.FC<Props> = ({ initialTask, onSuccess }) => {
  const { data: users } = useUsers();
  const { create, update } = useTaskMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      status: 'TO_DO',
      assignedToId: undefined
    }
  });

  useEffect(() => {
    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description,
        dueDate: toLocalInput(initialTask.dueDate),
        priority: initialTask.priority,
        status: initialTask.status,
        assignedToId: initialTask.assignedToId || undefined
      });
    }
  }, [initialTask, reset]);

  const onSubmit = async (values: FormData) => {
    const payload = {
      ...values,
      dueDate: new Date(values.dueDate).toISOString()
    };
    if (initialTask) {
      await update.mutateAsync({ id: initialTask.id, payload });
    } else {
      await create.mutateAsync(payload);
      reset();
    }
    onSuccess?.();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
          <input
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            {...register('title')}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Due Date</label>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            {...register('dueDate')}
          />
          {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
          rows={3}
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            {...register('priority')}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            {...register('status')}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Assignee</label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500"
            {...register('assignedToId', { setValueAs: (v) => (v === '' ? null : v) })}
          >
            <option value="">Unassigned</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {initialTask ? 'Update task' : 'Create task'}
      </button>
    </form>
  );
};
