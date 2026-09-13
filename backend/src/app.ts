import express from 'express';
import projectsRouter from './routes/projects.routes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use('/api/v1/projects', projectsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;