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
  const projects = await getAllProjects();
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
  // TODO: replace with req.user.id once auth middleware exists (Lesson 7)
  const TEMP_OWNER_ID = process.env.TEMP_OWNER_ID as string;
  const project = await createProject({ name, description, ownerId: TEMP_OWNER_ID });
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
  const project = await updateProject(req.params.id, req.body);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json(project);
});

export const handleDeleteProject = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const wasDeleted = await deleteProject(req.params.id);

  if (!wasDeleted) {
    throw new AppError('Project not found', 404);
  }

  res.status(204).send();
});