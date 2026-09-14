import { prisma } from '../config/prisma.js';

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export async function getDashboardStats(ownerId: string): Promise<DashboardStats> {
  const [totalProjects, totalTasks, completedTasks, overdueTasks] = await Promise.all([
    prisma.project.count({ where: { ownerId } }),
    prisma.task.count({ where: { project: { ownerId } } }),
    prisma.task.count({ where: { project: { ownerId }, status: 'DONE' } }),
    prisma.task.count({
      where: {
        project: { ownerId },
        status: { not: 'DONE' },
        dueDate: { lt: new Date() },
      },
    }),
  ]);

  const pendingTasks = totalTasks - completedTasks;

  return { totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks };
}