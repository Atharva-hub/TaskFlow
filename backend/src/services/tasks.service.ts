import { prisma } from '../config/prisma.js';
import { Task, TaskStatus, TaskPriority } from '@prisma/client';

export async function getAllTasks(ownerId: string): Promise<Task[]> {
  return prisma.task.findMany({
    where: { project: { ownerId } },
  });
}

export async function getTaskById(id: string): Promise<Task | null> {
  return prisma.task.findUnique({ where: { id } });
}

interface CreateTaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
  projectId: string;
}

export async function createTask(data: CreateTaskData): Promise<Task> {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      projectId: data.projectId,
    },
  });
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

export async function updateTask(
  id: string,
  data: UpdateTaskData
): Promise<Task | null> {
  try {
    return await prisma.task.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteTask(id: string): Promise<boolean> {
  try {
    await prisma.task.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}