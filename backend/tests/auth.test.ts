import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { cleanDatabase } from './helpers/db.js';
import { prisma } from '../src/config/prisma.js';

describe('Auth', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('creates a new user and never returns the password hash', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'alice@example.com', password: 'supersecret123' });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('alice@example.com');
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('rejects a duplicate email with 409', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'alice@example.com', password: 'supersecret123' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'alice@example.com', password: 'supersecret123' });

      expect(res.status).toBe(409);
    });

    it('rejects a malformed email with 400', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: 'supersecret123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'alice@example.com', password: 'supersecret123' });
    });

    it('logs in with correct credentials and returns a token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@example.com', password: 'supersecret123' });

      expect(res.status).toBe(200);
      expect(typeof res.body.token).toBe('string');
    });

    it('rejects a wrong password with a generic 401 message', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'alice@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });
});