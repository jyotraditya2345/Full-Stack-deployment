import { api } from './client';
import type { DashboardData, Task, TaskPriority, TaskStatus } from '../types';

export const fetchTasks = async (filters: {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: 'asc' | 'desc';
}) => {
  const { data } = await api.get<{ tasks: Task[] }>('/tasks', { params: filters });
  return data.tasks;
};

export const fetchDashboard = async () => {
  const { data } = await api.get<DashboardData>('/tasks/dashboard');
  return data;
};

export const createTask = async (payload: Partial<Task> & { title: string; description: string; dueDate: string }) => {
  const { data } = await api.post<{ task: Task }>('/tasks', payload);
  return data.task;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
  const { data } = await api.patch<{ task: Task }>(`/tasks/${id}`, payload);
  return data.task;
};

export const deleteTask = async (id: string) => api.delete(`/tasks/${id}`);
