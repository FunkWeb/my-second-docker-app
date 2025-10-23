import listenToTasks from './listeners/task.listener.js';

async function main() {
  const taskListener = listenToTasks();

  process.on('SIGTERM', async () => {
    await taskListener.close();
    process.exit(0);
  });

  console.log('Worker running...');
}

void main();
