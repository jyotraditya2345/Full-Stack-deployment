import React, { useMemo, useState } from 'react';
import { useNotifications, useNotificationMutations } from '../hooks/useNotifications';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const { markRead } = useNotificationMutations();

  const unread = useMemo(
    () => (notifications || []).filter((n) => !n.read).length,
    [notifications]
  );

  const handleRead = (id: string) => {
    markRead.mutate(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
        aria-label="Notifications"
      >
        <span role="img" aria-hidden className="text-lg">
          🔔
        </span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="px-3 py-2 text-sm font-semibold text-slate-700">Notifications</div>
          <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
            {isLoading && <div className="p-3 text-sm text-slate-500">Loading...</div>}
            {!isLoading && notifications?.length === 0 && (
              <div className="p-3 text-sm text-slate-500">No notifications</div>
            )}
            {notifications?.map((n) => (
              <div
                key={n.id}
                className={`p-3 text-sm ${n.read ? 'bg-white' : 'bg-slate-50 font-medium'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>{n.message}</div>
                  {!n.read && (
                    <button
                      onClick={() => handleRead(n.id)}
                      className="text-xs text-brand-600 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
