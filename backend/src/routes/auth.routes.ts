import { Router } from 'express';
import { handleRegister, handleLogin } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validation/auth.schema.js';

const router = Router();

router.post('/register', validateBody(registerSchema), handleRegister);
router.post('/login', validateBody(loginSchema), handleLogin);

export default router;