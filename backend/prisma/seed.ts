import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEMO_EMAIL = 'demo@taskflow.dev';
const DEMO_PASSWORD = 'DemoPass123!';

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      passwordHash,
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

  await prisma.task.create({
    data: {
      title: 'Draft homepage copy',
      description: 'Write hero, feature, and footer copy for review',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      projectId: project.id,
    },
  });

  console.log('Seed complete.');
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });