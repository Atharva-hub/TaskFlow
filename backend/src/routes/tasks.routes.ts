import { Router } from 'express';
import {
  handleGetAllTasks,
  handleGetTaskById,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} from '../controllers/tasks.controller.js';

const router = Router();

router.get('/', handleGetAllTasks);
router.post('/', handleCreateTask);
router.get('/:id', handleGetTaskById);
router.put('/:id', handleUpdateTask);
router.delete('/:id', handleDeleteTask);

export default router;