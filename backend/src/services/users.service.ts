import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { User } from '@prisma/client';

const SALT_ROUNDS = 10;

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

interface CreateUserData {
  email: string;
  password: string;
}

export async function createUser(data: CreateUserData): Promise<User> {
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
    },
  });
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}