import { Router } from 'express';
import { handleGetDashboard } from '../controllers/dashboard.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', handleGetDashboard);

export default router;