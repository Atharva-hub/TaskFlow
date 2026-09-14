import { Request, Response } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  TaskFilters,
} from '../services/tasks.service.js';
import { getProjectById } from '../services/projects.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { TaskStatus, TaskPriority } from '@prisma/client';

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const VALID_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_SORT_FIELDS = ['dueDate', 'createdAt', 'priority', 'title'] as const;
const VALID_ORDERS = ['asc', 'desc'] as const;

interface TaskQueryParams {
  status?: string;
  priority?: string;
  sortBy?: string;
  order?: string;
}

export const handleGetAllTasks = asyncHandler(async (
  req: Request<{}, {}, {}, TaskQueryParams>,
  res: Response
) => {
  const { status, priority, sortBy, order } = req.query;
  const filters: TaskFilters = {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status as TaskStatus)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }
    filters.status = status as TaskStatus;
  }

  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority as TaskPriority)) {
      throw new AppError(`Invalid priority: ${priority}`, 400);
    }
    filters.priority = priority as TaskPriority;
  }

  if (sortBy !== undefined) {
    if (!VALID_SORT_FIELDS.includes(sortBy as typeof VALID_SORT_FIELDS[number])) {
      throw new AppError(`Invalid sortBy: ${sortBy}`, 400);
    }
    filters.sortBy = sortBy as TaskFilters['sortBy'];
  }

  if (order !== undefined) {
    if (!VALID_ORDERS.includes(order as typeof VALID_ORDERS[number])) {
      throw new AppError(`Invalid order: ${order}`, 400);
    }
    filters.order = order as TaskFilters['order'];
  }

  const ownerId = req.user!.userId;
  const tasks = await getAllTasks(ownerId, filters);
  res.json(tasks);
});

export const handleGetTaskById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const task = await assertTaskAccess(req.params.id, req.user!.userId);
  res.json(task);
});

async function assertTaskAccess(taskId: string, userId: string) {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const project = await getProjectById(task.projectId);
  if (!project || project.ownerId !== userId) {
    throw new AppError('You do not have access to this task', 403);
  }

  return task;
}

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

  const project = await getProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.ownerId !== req.user!.userId) {
    throw new AppError('You do not have access to this project', 403);
  }

  const task = await createTask({
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
    projectId,
  });
  res.status(201).json(task);
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
  await assertTaskAccess(req.params.id, req.user!.userId);

  const { dueDate, ...rest } = req.body;
  const task = await updateTask(req.params.id, {
    ...rest,
    ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
  });

  res.json(task);
});

export const handleDeleteTask = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  await assertTaskAccess(req.params.id, req.user!.userId);
  await deleteTask(req.params.id);
  res.status(204).send();
});