import { Queue } from 'bullmq';
import { redis } from '../redis.js';
import {TaskJobData} from "../types/task.js";

export const tasksQueue = new Queue<TaskJobData>('tasks', {
  connection: redis,
});
