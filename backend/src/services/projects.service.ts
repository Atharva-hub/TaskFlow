import { prisma } from '../config/prisma.js';
import { Project, ProjectStatus } from '@prisma/client';

export async function getAllProjects(): Promise<Project[]> {
  return prisma.project.findMany();
}

export async function getProjectById(id: string): Promise<Project | null> {
  return prisma.project.findUnique({ where: { id } });
}

interface CreateProjectData {
  name: string;
  description: string;
  ownerId: string;
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
    },
  });
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export async function updateProject(
  id: string,
  data: UpdateProjectData
): Promise<Project | null> {
  try {
    return await prisma.project.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}