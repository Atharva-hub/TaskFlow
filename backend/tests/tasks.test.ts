import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { cleanDatabase } from './helpers/db.js';
import { createUserAndLogin } from './helpers/auth.js';
import { prisma } from '../src/config/prisma.js';

describe('Tasks', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createProject(token: string): Promise<string> {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test project', description: 'For task tests' });
    return res.body.id;
  }

  it('creates a task with default status and priority when omitted', async () => {
    const token = await createUserAndLogin('alice@example.com');
    const projectId = await createProject(token);

    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Write tests', description: 'Cover critical paths', projectId });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('TODO');
    expect(res.body.priority).toBe('MEDIUM');
  });

  it('returns 404 when creating a task for a non-existent project', async () => {
    const token = await createUserAndLogin('alice@example.com');

    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Broken task',
        description: 'test',
        projectId: '00000000-0000-0000-0000-000000000000',
      });

    expect(res.status).toBe(404);
  });

  it('filters tasks by status via query parameters', async () => {
    const token = await createUserAndLogin('alice@example.com');
    const projectId = await createProject(token);

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo task', description: 'd', projectId, status: 'TODO' });

    await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Done task', description: 'd', projectId, status: 'DONE' });

    const res = await request(app)
      .get('/api/v1/tasks?status=DONE')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Done task');
  });

  it('rejects an invalid status query value with 400', async () => {
    const token = await createUserAndLogin('alice@example.com');

    const res = await request(app)
      .get('/api/v1/tasks?status=notreal')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});