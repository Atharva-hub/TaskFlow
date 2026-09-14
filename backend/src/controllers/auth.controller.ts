import { Request, Response } from 'express';
import { createUser, findUserByEmail, verifyPassword } from '../services/users.service.js';
import { toPublicUser } from '../types/models.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';
import { RegisterInput, LoginInput } from '../validation/auth.schema.js';

export const handleRegister = asyncHandler(async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const { email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await createUser({ email, password });
  res.status(201).json(toPublicUser(user));
});

export const handleLogin = asyncHandler(async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ userId: user.id });
  res.json({ user: toPublicUser(user), token });
});