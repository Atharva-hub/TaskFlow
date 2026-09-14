import { Router } from 'express';
import {
  handleGetAllProjects,
  handleCreateProject,
  handleGetProjectById,
  handleUpdateProject,
  handleDeleteProject,
} from '../controllers/projects.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../validation/project.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', handleGetAllProjects);
router.post('/', validateBody(createProjectSchema), handleCreateProject);
router.get('/:id', handleGetProjectById);
router.put('/:id', validateBody(updateProjectSchema), handleUpdateProject);
router.delete('/:id', handleDeleteProject);

export default router;