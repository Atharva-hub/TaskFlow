import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
} from '../api/tasks';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types/models';
import { ApiError } from '../api/client';

export function useTasks(filters: TaskFilters = {}) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterKey = JSON.stringify(filters);

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      setTasks(await getTasks(filters, token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
    // filterKey is the real dependency; filters itself is a new object every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, filterKey]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(input: CreateTaskInput) {
    if (!token) return;
    const task = await apiCreateTask(input, token);
    setTasks((prev) => [task, ...prev]);
    return task;
  }

  async function updateTask(id: string, input: UpdateTaskInput) {
    if (!token) return;
    const updated = await apiUpdateTask(id, input, token);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }

  async function deleteTask(id: string) {
    if (!token) return;
    await apiDeleteTask(id, token);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, isLoading, error, refetch: fetchTasks, createTask, updateTask, deleteTask };
}