import { Router } from 'express';
import {
  handleGetAllProjects,
  handleCreateProject,
  handleGetProjectById,
  handleUpdateProject,
  handleDeleteProject,
} from '../controllers/projects.controller.js';

const router = Router();

router.get('/', handleGetAllProjects);
router.post('/', handleCreateProject);
router.get('/:id', handleGetProjectById);
router.put('/:id', handleUpdateProject);
router.delete('/:id', handleDeleteProject);

export default router;