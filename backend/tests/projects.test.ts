import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { cleanDatabase } from './helpers/db.js';
import { createUserAndLogin } from './helpers/auth.js';
import { prisma } from '../src/config/prisma.js';

describe('Projects', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('rejects requests with no token with 401', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });

  it('creates a project owned by the authenticated user', async () => {
    const token = await createUserAndLogin('alice@example.com');

    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Website redesign', description: 'Q4 refresh' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Website redesign');
  });

  it("returns 403 when a different user requests someone else's project", async () => {
    const aliceToken = await createUserAndLogin('alice@example.com');
    const charlieToken = await createUserAndLogin('charlie@example.com');

    const created = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${aliceToken}`)
      .send({ name: 'Alice project', description: 'Private' });

    const res = await request(app)
      .get(`/api/v1/projects/${created.body.id}`)
      .set('Authorization', `Bearer ${charlieToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 404 for a project id that does not exist', async () => {
    const token = await createUserAndLogin('alice@example.com');

    const res = await request(app)
      .get('/api/v1/projects/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});