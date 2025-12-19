import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="card animate-pulse p-4">
      <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
      <div className="mb-2 h-3 w-full rounded bg-slate-200" />
      <div className="h-3 w-1/2 rounded bg-slate-200" />
    </div>
  );
};
