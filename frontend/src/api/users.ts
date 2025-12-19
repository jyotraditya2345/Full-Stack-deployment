import { api } from './client';
import type { User } from '../types';

export const fetchUsers = async () => {
  const { data } = await api.get<{ users: User[] }>('/users');
  return data.users;
};
