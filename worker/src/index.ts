import listenToPing from './listeners/ping.listener';
import listenToTasks from './listeners/task.listener';
import {Queue} from 'bullmq';
import {redis} from './redis';

async function main() {
  const pingListener = await listenToPing();
  const taskListener = await listenToTasks();

  console.log('Ping listener started...');
  console.log('Task listener started...');

  const pingQueue = new Queue('ping', {connection: redis});
  await pingQueue.add('ping', {});

  console.log('Ping job added...');

  process.on('SIGTERM', async () => {
    await pingListener.close();
    await taskListener.close();
    await pingQueue.close();
    await redis.quit();

    process.exit(0);
  });
}

void main();
