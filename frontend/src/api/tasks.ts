import { apiRequest } from './client';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types/models';

function buildQueryString(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.order) params.set('order', filters.order);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getTasks(filters: TaskFilters, token: string): Promise<Task[]> {
  return apiRequest<Task[]>(`/tasks${buildQueryString(filters)}`, { token });
}

export function getTask(id: string, token: string): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, { token });
}

export function createTask(data: CreateTaskInput, token: string): Promise<Task> {
  return apiRequest<Task>('/tasks', { method: 'POST', body: data, token });
}

export function updateTask(id: string, data: UpdateTaskInput, token: string): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}`, { method: 'PUT', body: data, token });
}

export function deleteTask(id: string, token: string): Promise<void> {
  return apiRequest<void>(`/tasks/${id}`, { method: 'DELETE', token });
}