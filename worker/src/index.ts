// worker/src/index.ts
import listenToPing from './listeners/ping.listener.js';  // ← Added .js
import listenToTasks from './listeners/task.listener.js';  // ← Added .js

async function main() {
  const pingListener = await listenToPing();
  const taskListener = await listenToTasks();

  process.on('SIGTERM', async () => {
    await pingListener.close();
    await taskListener.close();

    process.exit(0);
  });

  console.log('✅ Worker is running and listening to queues...');
}

void main();
