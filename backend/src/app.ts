import express from 'express';
import projectsRouter from './routes/projects.routes.js';

const app = express();

app.use(express.json());

app.use('/api/v1/projects', projectsRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

export default app;