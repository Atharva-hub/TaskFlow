import { Request, Response } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../services/tasks.service.js';
import { getProjectById } from '../services/projects.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from '../validation/task.schema.js';

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

export const handleGetAllTasks = asyncHandler(async (
  req: Request<{}, {}, {}, TaskQueryInput>,
  res: Response
) => {
  const ownerId = req.user!.userId;
  const tasks = await getAllTasks(ownerId, req.query);
  res.json(tasks);
});

export const handleGetTaskById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const task = await assertTaskAccess(req.params.id, req.user!.userId);
  res.json(task);
});

export const handleCreateTask = asyncHandler(async (
  req: Request<{}, {}, CreateTaskInput>,
  res: Response
) => {
  const { projectId, dueDate, ...rest } = req.body;

  const project = await getProjectById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.ownerId !== req.user!.userId) {
    throw new AppError('You do not have access to this project', 403);
  }

  const task = await createTask({
    ...rest,
    projectId,
    dueDate: dueDate ? new Date(dueDate) : null,
  });
  res.status(201).json(task);
});

export const handleUpdateTask = asyncHandler(async (
  req: Request<{ id: string }, {}, UpdateTaskInput>,
  res: Response
) => {
  await assertTaskAccess(req.params.id, req.user!.userId);

  const { dueDate, ...rest } = req.body;
  const task = await updateTask(req.params.id, {
    ...rest,
    ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}),
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