import request from 'supertest';
import app from '../../src/app.js';

export async function createUserAndLogin(
  email: string,
  password = 'supersecret123'
): Promise<string> {
  await request(app).post('/api/v1/auth/register').send({ email, password });
  const res = await request(app).post('/api/v1/auth/login').send({ email, password });
  return res.body.token as string;
}