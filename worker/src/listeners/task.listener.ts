import {Worker, type Job} from 'bullmq';
import redis from '../redis.js';
import taskJob from '../jobs/task.job.js';

const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {
  const worker = new Worker(QUEUE_NAME, taskJob, {connection: redis});

  worker.on('ready', () => {
    // TODO: on task ready
  });

  worker.on('active', (job: Job) => {
    // TODO: on task active
  });

  worker.on('completed', (job: Job, result: unknown) => {
    // TODO: on task completed
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    // TODO: on task failed
  });

  worker.on('error', (err: Error) => {
    // TODO: on task error
  });

  return worker;
}
