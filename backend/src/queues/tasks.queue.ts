import { Queue } from 'bullmq';
import { redis } from '../redis.js';
import { Task } from '../types/task.js';

export const tasksQueue = new Queue<Task>('tasks', { connection: redis });
