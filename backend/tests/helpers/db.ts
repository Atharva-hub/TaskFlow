import { prisma } from '../../src/config/prisma.js';

export async function cleanDatabase() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}