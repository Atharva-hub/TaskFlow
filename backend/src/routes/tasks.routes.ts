import { Router } from 'express';
import {
  handleGetAllTasks,
  handleGetTaskById,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateBody, validateQuery } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../validation/task.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', validateQuery(taskQuerySchema), handleGetAllTasks);
router.post('/', validateBody(createTaskSchema), handleCreateTask);
router.get('/:id', handleGetTaskById);
router.put('/:id', validateBody(updateTaskSchema), handleUpdateTask);
router.delete('/:id', handleDeleteTask);

export default router;