import {Worker, type Job} from 'bullmq';
import {redis} from '../redis';
import pingJob from '../jobs/ping.job';

const QUEUE_NAME = 'ping';

export default async function listenToPing() {
  const worker = new Worker(QUEUE_NAME, pingJob, {
    connection: redis,
  });

  await worker.waitUntilReady();

  worker.on('error', (err) => {
    console.error(err)
  });

  worker.on('completed', (_job: Job, result: string) => {
    console.log(result);
  });

  return worker;
}
