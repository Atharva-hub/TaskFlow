import { Router } from 'express';
import {
  handleGetAllProjects,
  handleCreateProject,
  handleGetProjectById,
  handleUpdateProject,
  handleDeleteProject,
} from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', handleGetAllProjects);
router.post('/', handleCreateProject);
router.get('/:id', handleGetProjectById);
router.put('/:id', handleUpdateProject);
router.delete('/:id', handleDeleteProject);

export default router;