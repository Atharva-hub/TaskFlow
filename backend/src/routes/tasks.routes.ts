import { Router } from 'express';
import {
  handleGetAllTasks,
  handleGetTaskById,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = Router();

router.use(authMiddleware);

router.get('/', handleGetAllTasks);
router.post('/', handleCreateTask);
router.get('/:id', handleGetTaskById);
router.put('/:id', handleUpdateTask);
router.delete('/:id', handleDeleteTask);

export default router;