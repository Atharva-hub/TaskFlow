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

export const handleGetAllProjects = asyncHandler(async (
  req: Request,
  res: Response,
  next
) => {
  const projects = getAllProjects();
  res.json(projects);
});

interface CreateProjectBody {
  name: string;
  description: string;
}

export const handleCreateProject = asyncHandler(async (
  req: Request<{}, {}, CreateProjectBody>,
  res: Response,
  next
) => {
  const { name, description } = req.body;
  const project = createProject({ name, description });
  res.status(201).json(project);
});

export const handleGetProjectById = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response,
  next
) => {
  const project = getProjectById(req.params.id);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json(project);
});

interface UpdateProjectBody {
  name?: string;
  description?: string;
}

export const handleUpdateProject = asyncHandler(async (
  req: Request<{ id: string }, {}, UpdateProjectBody>,
  res: Response,
  next
) => {
  const project = updateProject(req.params.id, req.body);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.json(project);
});

export const handleDeleteProject = asyncHandler(async (
  req: Request<{ id: string }>,
  res: Response,
  next
) => {
  const wasDeleted = deleteProject(req.params.id);

  if (!wasDeleted) {
    throw new AppError('Project not found', 404);
  }

  res.status(204).send();
});