import { Worker, Job } from 'bullmq';
import { redis } from '../redis.js';
import taskJob from '../jobs/task.job.js';
import {Task} from "../types/task.type";

export default function listenToTasks() {
  const worker = new Worker<Task>('tasks', taskJob, { connection: redis });

  worker.on('ready', () => console.log(`[tasks] Worker ready`));

  worker.on('active', async (job: Job<Task>) => {
    await job.updateData({ ...job.data, status: 'active', startedAt: new Date().toISOString() });
  });

  worker.on('completed', async (job: Job<Task>, result) => {
    await job.updateData({ ...job.data, status: 'completed', completedAt: new Date().toISOString(), result });
  });

  worker.on('failed', async (job: Job<Task> | undefined, err: Error) => {
    if (!job) return;
    await job.updateData({ ...job.data, status: 'failed', failedAt: new Date().toISOString(), error: err.message });
  });

  return worker;
}
