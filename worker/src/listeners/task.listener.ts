import {Worker, type Job} from 'bullmq';
import {redis} from '../redis';
import taskJob from '../jobs/task.job';

const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {
  const worker = new Worker(QUEUE_NAME, taskJob, {
    connection: redis,
  });

  worker.on('ready', () => {
    console.log(`Worker is ready and listening to queue: ${QUEUE_NAME}`);
  });

  worker.on('active', (job: Job) => {
    console.log(`Job ${job.id} is now active`);
  });

  worker.on('completed', (job: Job, result: unknown) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
  });

  worker.on('error', (err: Error) => {
    console.error(`Worker error: ${err.message}`);
  });

  return worker;
}
