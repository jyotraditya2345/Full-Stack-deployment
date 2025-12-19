import { api } from './client';
import type { Notification } from '../types';

export const fetchNotifications = async () => {
  const { data } = await api.get<{ notifications: Notification[] }>('/notifications');
  return data.notifications;
};

export const markNotificationRead = async (id: string) => {
  const { data } = await api.patch<{ notification: Notification }>(`/notifications/${id}/read`);
  return data.notification;
};
