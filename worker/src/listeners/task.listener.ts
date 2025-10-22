import { Worker } from 'bullmq';
import { redis } from '../redis.js';
import taskJob from '../jobs/task.job.js';
import {TaskJobData} from "../types/task.type";

export default function listenToTasks() {
  const worker = new Worker<TaskJobData>('tasks', taskJob, { connection: redis });

  worker.on('ready', () => console.log(`[tasks] Worker ready`));
  worker.on('completed', job => console.log(`Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));

  return worker;
}
