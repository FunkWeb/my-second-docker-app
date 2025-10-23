// worker/src/listeners/task.listener.ts
import { Worker, type Job } from 'bullmq';
import { redis } from '../redis.js';  // ← Added .js extension
import taskJob from '../jobs/task.job.js';  // ← Added .js extension

const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {
  const worker = new Worker(QUEUE_NAME, taskJob, {
    connection: redis,
  });

  worker.on('ready', () => {
    console.log('✅ Task worker ready');
  });

  worker.on('active', (job: Job) => {
    console.log(`🔄 Processing job ${job.id}`);
  });

  worker.on('completed', (job: Job, result: unknown) => {
    console.log(`✅ Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`❌ Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err: Error) => {
    console.error('❌ Worker error:', err);
  });

  return worker;
}
