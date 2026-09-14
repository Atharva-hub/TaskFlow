import { Request, Response } from 'express';
import { createUser, findUserByEmail, verifyPassword } from '../services/users.service.js';
import { toPublicUser } from '../types/models.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

interface RegisterBody {
  email: string;
  password: string;
}

export const handleRegister = asyncHandler(async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await createUser({ email, password });
  res.status(201).json(toPublicUser(user));
});

interface LoginBody {
  email: string;
  password: string;
}

export const handleLogin = asyncHandler(async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

 
  res.json(toPublicUser(user));
});