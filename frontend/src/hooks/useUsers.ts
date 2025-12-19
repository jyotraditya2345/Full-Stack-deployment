import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';
import type { User } from '../types';

export const useUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers
  });
