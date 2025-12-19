import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { TaskCard } from '../components/TaskCard';
import { TaskSkeleton } from '../components/TaskSkeleton';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useDashboard();

  const section = (title: string, tasks?: any[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      )}
      {!isLoading && tasks && tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Nothing here yet.
        </div>
      )}
      {!isLoading && tasks && tasks.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-slate-500">Overview</p>
        <h1 className="text-2xl font-bold text-slate-900">Your dashboard</h1>
        <p className="text-sm text-slate-600">
          Keep track of what you own, what you created, and what needs attention.
        </p>
      </div>
      <div className="space-y-10">
        {section('Assigned to you', data?.assigned)}
        {section('Created by you', data?.created)}
        {section('Overdue', data?.overdue)}
      </div>
    </div>
  );
};
