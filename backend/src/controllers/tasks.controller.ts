import { Request, Response } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/tasks.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { TaskStatus, TaskPriority } from '@prisma/client';

export const handleGetAllTasks = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

export const handleGetTaskById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const task = await getTaskById(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json(task);
});

interface CreateTaskBody {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  projectId: string;
}

export const handleCreateTask = asyncHandler(async (
  req: Request<{}, {}, CreateTaskBody>,
  res: Response
) => {
  const { title, description, status, priority, dueDate, projectId } = req.body;

  try {
    const task = await createTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      projectId,
    });
    res.status(201).json(task);
  } catch {
    throw new AppError('Project not found', 404);
  }
});

interface UpdateTaskBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export const handleUpdateTask = asyncHandler(async (
  req: Request<{ id: string }, {}, UpdateTaskBody>,
  res: Response
) => {
  const { dueDate, ...rest } = req.body;

  const task = await updateTask(req.params.id, {
    ...rest,
    ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json(task);
});

export const handleDeleteTask = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const wasDeleted = await deleteTask(req.params.id);

  if (!wasDeleted) {
    throw new AppError('Task not found', 404);
  }

  res.status(204).send();
});