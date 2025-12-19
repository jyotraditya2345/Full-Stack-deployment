import React, { useMemo, useState } from 'react';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { TaskSkeleton } from '../components/TaskSkeleton';
import { useTasks, useTaskMutations } from '../hooks/useTasks';
import type { Task, TaskPriority, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
    sort?: 'asc' | 'desc';
  }>({ sort: 'asc' });
  const [editing, setEditing] = useState<Task | null>(null);
  const { data: tasks, isLoading } = useTasks(filters);
  const { remove } = useTaskMutations();

  const sortedTasks = useMemo(() => tasks || [], [tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">Tasks</p>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-slate-900">Plan, track, and unblock work</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: (e.target.value || undefined) as TaskStatus }))
              }
            >
              <option value="">All Statuses</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
              value={filters.priority || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  priority: (e.target.value || undefined) as TaskPriority
                }))
              }
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <select
              className="rounded-lg border border-slate-200 bg-white px-3 py-2"
              value={filters.sort || 'asc'}
              onChange={(e) =>
                setFilters((f) => ({ ...f, sort: e.target.value as 'asc' | 'desc' }))
              }
            >
              <option value="asc">Due soonest</option>
              <option value="desc">Due latest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {editing ? 'Edit task' : 'Create a task'}
          </h2>
          {editing && (
            <button className="text-sm text-brand-600" onClick={() => setEditing(null)}>
              Cancel edit
            </button>
          )}
        </div>
        <TaskForm initialTask={editing} onSuccess={() => setEditing(null)} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {isLoading && (
          <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
          </>
        )}
        {!isLoading && sortedTasks.length === 0 && (
          <div className="card col-span-2 flex items-center justify-center p-8 text-slate-500">
            No tasks match your filters.
          </div>
        )}
        {!isLoading &&
          sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => setEditing(t)}
              onDelete={(t) => remove.mutate(t.id)}
            />
          ))}
      </div>
    </div>
  );
};
