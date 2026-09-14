import { Request, Response } from 'express';
import {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from '../services/projects.service.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ProjectStatus } from '@prisma/client';

export const handleGetAllProjects = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const ownerId = req.user!.userId;
  const projects = await getAllProjects(ownerId);
  res.json(projects);
});

interface CreateProjectBody {
  name: string;
  description: string;
}

export const handleCreateProject = asyncHandler(async (
  req: Request<{}, {}, CreateProjectBody>,
  res: Response
) => {
  const { name, description } = req.body;
  const ownerId = req.user!.userId;
  const project = await createProject({ name, description, ownerId });
  res.status(201).json(project);
});

export const handleGetProjectById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const project = await getProjectById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }
  if (project.ownerId !== req.user!.userId) {
    throw new AppError('You do not have access to this project', 403);
  }

  res.json(project);
});

interface UpdateProjectBody {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export const handleUpdateProject = asyncHandler(async (
  req: Request<{ id: string }, {}, UpdateProjectBody>,
  res: Response
) => {
  const existing = await getProjectById(req.params.id);

  if (!existing) {
    throw new AppError('Project not found', 404);
  }
  if (existing.ownerId !== req.user!.userId) {
    throw new AppError('You do not have access to this project', 403);
  }

  const project = await updateProject(req.params.id, req.body);
  res.json(project);
});

export const handleDeleteProject = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const existing = await getProjectById(req.params.id);

  if (!existing) {
    throw new AppError('Project not found', 404);
  }
  if (existing.ownerId !== req.user!.userId) {
    throw new AppError('You do not have access to this project', 403);
  }

  await deleteProject(req.params.id);
  res.status(204).send();
});