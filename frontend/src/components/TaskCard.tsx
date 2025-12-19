import React from 'react';
import type { Task } from '../types';

const statusStyles: Record<Task['status'], string> = {
  TO_DO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  REVIEW: 'bg-indigo-100 text-indigo-800',
  COMPLETED: 'bg-emerald-100 text-emerald-700'
};

const priorityStyles: Record<Task['priority'], string> = {
  LOW: 'text-slate-500',
  MEDIUM: 'text-slate-700',
  HIGH: 'text-amber-600',
  URGENT: 'text-red-600'
};

interface Props {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          <p className="text-sm text-slate-600">{task.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-slate-100 px-2 py-1">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <span className={priorityStyles[task.priority]}>Priority: {task.priority}</span>
        {task.assignedToId ? (
          <span className="rounded-full bg-slate-100 px-2 py-1">Assigned</span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-1">Unassigned</span>
        )}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2">
          {onEdit && (
            <button className="btn-secondary text-xs" onClick={() => onEdit(task)}>
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn-secondary text-xs text-red-600"
              onClick={() => onDelete(task)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};
