// backend/src/app.ts

import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.handler.js';
import { pingQueue } from './queues/ping.queue.js';
import { taskQueue } from './queues/tasks.queue.js';
import { taskQueries } from './db/task.queries.js';
import taskController from './controllers/task.controller.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Express is working!' });
});

console.log('Setting up routes...');

// Health route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});

// Ping route with queue integration
app.get('/api/v1/ping', async (req, res) => {
  try {
    await pingQueue.add('ping', {});
    const counts = await pingQueue.getJobCounts();
    res.json({
      status: 'ok',
      counts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add job to queue'
    });
  }
});

// Task routes
app.use('/api/v1/tasks', taskController);

console.log('Routes registered!');

app.use(errorHandler);

export default app;
