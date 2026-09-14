import express from 'express';
import authRouter from './routes/auth.routes.js';
import projectsRouter from './routes/projects.routes.js';
import tasksRouter from './routes/tasks.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import { env } from './config/env.js';

const app = express();
app.use(cors({ origin: env.corsOrigin, credentials: true }));

app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;