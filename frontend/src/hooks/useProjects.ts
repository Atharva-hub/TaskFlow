import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getProjects,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
} from '../api/projects';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types/models';
import { ApiError } from '../api/client';

export function useProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await getProjects(token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function createProject(input: CreateProjectInput) {
    if (!token) return;
    const project = await apiCreateProject(input, token);
    setProjects((prev) => [project, ...prev]);
    return project;
  }

  async function updateProject(id: string, input: UpdateProjectInput) {
    if (!token) return;
    const updated = await apiUpdateProject(id, input, token);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  async function deleteProject(id: string) {
    if (!token) return;
    await apiDeleteProject(id, token);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return { projects, isLoading, error, refetch: fetchProjects, createProject, updateProject, deleteProject };
}