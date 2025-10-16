import {Worker, type Job} from 'bullmq';
import {redis} from '../redis';
import pingJob from '../jobs/ping.job';

const QUEUE_NAME = 'ping';

export default async function listenToPing() {
  const worker = new Worker(QUEUE_NAME, pingJob, {connection: redis});

  await worker.waitUntilReady();

  worker.on('completed', (job: Job, result: string) => {
    console.log(result);
  });

  worker.on('error', (err) => {
    console.error('Ping worker error:', err);
  });

  return worker;
}
