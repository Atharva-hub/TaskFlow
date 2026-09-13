import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskflow.dev',
      passwordHash: 'placeholder-will-be-real-hash-in-lesson-6',
    },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Website redesign',
      description: 'Q4 marketing site refresh',
      ownerId: user.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Set up design system',
      description: 'Define colors, typography, spacing tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      projectId: project.id,
    },
  });

  console.log('Seed complete. Demo user id:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });