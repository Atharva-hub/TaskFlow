import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const handleGetDashboard = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const ownerId = req.user!.userId;
  const stats = await getDashboardStats(ownerId);
  res.json(stats);
});