import listenToPing from './listeners/ping.listener';
import listenToTasks from './listeners/task.listener';

async function main() {
  const pingListener = await listenToPing();
  const taskListener = await listenToTasks();

  process.on('SIGTERM', async () => {
    await pingListener.close();
    await taskListener.close();

    process.exit(0);
  });

  console.log('Worker is running and listening to queues...');
}

void main();
