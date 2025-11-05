import {Worker, type Job} from 'bullmq';
import {redis} from '../redis';
import taskJob from '../jobs/task.job';

const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {
  const worker = new Worker(QUEUE_NAME, taskJob, {
    connection: redis,
  });

  await worker.waitUntilReady();

  worker.on('ready', () => {
    console.log(`Worker ready and listening to queue: ${QUEUE_NAME}`);
  });

  worker.on('active', (job: Job) => {
    console.log(`Processing job: ID:${job.id} Name:${job.name}`, {
      data: job.data,
      attempts: job.attemptsMade
    });
  });

  worker.on('completed', (job: Job, result: unknown) => {
    console.log(`Job: ID:${job.id} Name:${job.name} completed successfully`, {
      name: job.name,
      duration: `${Date.now() - job.processedOn!}ms`,
      result
    });
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    if (!job) {
      console.error('Job failed with no job data:', err);
      return;
    }

    console.error(`Job ${job.id} failed`, {
      name: job.name,
      attempts: job.attemptsMade,
      maxAttempts: job.opts.attempts,
      error: err.message,
      stack: err.stack,
      data: job.data
    });

    if (job.attemptsMade >= (job.opts.attempts || 1)) {
      console.error(`Job ${job.id} permanently failed after ${job.attemptsMade} attempts`);
      // TODO: Send to dead letter queue, alert monitoring, etc.
    }
  });

  worker.on('error', (err: Error) => {
    console.error('Worker error:', {
      message: err.message,
      stack: err.stack
    });
    // TODO: Alert monitoring system
  });

  worker.on('closed', () => {
    console.log(`Worker closed for queue: ${QUEUE_NAME}`);
  });

  return worker;
}
