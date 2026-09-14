import { apiRequest } from './client';
import type { DashboardStats } from '../types/models';

export function getDashboardStats(token: string): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/dashboard', { token });
}