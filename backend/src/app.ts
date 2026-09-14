import express from 'express';
import projectsRouter from './routes/projects.routes.js';
import tasksRouter from './routes/tasks.routes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRouter from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/tasks', tasksRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;