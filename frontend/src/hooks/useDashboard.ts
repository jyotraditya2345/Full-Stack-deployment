import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../api/tasks';
import type { DashboardData } from '../types';

export const useDashboard = () =>
  useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard
  });
