import { apiRequest } from './client';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types/models';

export function getProjects(token: string): Promise<Project[]> {
  return apiRequest<Project[]>('/projects', { token });
}

export function getProject(id: string, token: string): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, { token });
}

export function createProject(data: CreateProjectInput, token: string): Promise<Project> {
  return apiRequest<Project>('/projects', { method: 'POST', body: data, token });
}

export function updateProject(
  id: string,
  data: UpdateProjectInput,
  token: string
): Promise<Project> {
  return apiRequest<Project>(`/projects/${id}`, { method: 'PUT', body: data, token });
}

export function deleteProject(id: string, token: string): Promise<void> {
  return apiRequest<void>(`/projects/${id}`, { method: 'DELETE', token });
}