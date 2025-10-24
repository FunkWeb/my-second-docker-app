import { Queue } from 'bullmq';
import { redis } from '../redis.js';
import {TaskJobData} from "@shared/types.js";

export const tasksQueue = new Queue<TaskJobData>('tasks', {
  connection: redis,
});
