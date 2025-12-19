import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks';
import type { Task, TaskPriority, TaskStatus } from '../types';

export const useTasks = (filters: { status?: TaskStatus; priority?: TaskPriority; sort?: 'asc' | 'desc' }) =>
  useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters)
  });

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: invalidate
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) => updateTask(id, payload),
    onSuccess: invalidate
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: invalidate
  });

  return { create, update, remove };
};
