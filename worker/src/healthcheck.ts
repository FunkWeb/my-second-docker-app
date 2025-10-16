import {Queue, QueueEvents} from 'bullmq';
import {redis} from './redis';

async function main() {
  const queueName = 'ping';
  const queue = new Queue(queueName, {connection: redis});
  const events = new QueueEvents(queueName, {connection: redis});

  await events.waitUntilReady();

  const job = await queue.add('ping', {});

  const timeout = setTimeout(async () => {
    console.error('Healthcheck: timeout waiting for pong');

    await cleanup(1);
  }, 5000);

  events.on('completed', async ({jobId, returnvalue}) => {
    if (jobId === job.id && returnvalue === 'pong') {
      clearTimeout(timeout);

      await cleanup(0);
    }
  });

  events.on('failed', async ({jobId, failedReason}) => {
    if (jobId === job.id) {
      clearTimeout(timeout);

      console.error('Healthcheck: job failed:', failedReason);

      await cleanup(1);
    }
  });

  async function cleanup(code: number) {
    try {
      await queue.close();
      await events.close();
      await redis.quit();
    } finally {
      process.exit(code);
    }
  }
}

main().catch((err) => {
  console.error('Healthcheck: error:', err);

  process.exit(1);
});
