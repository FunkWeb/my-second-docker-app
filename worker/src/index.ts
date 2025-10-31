import listenToTasks from './listeners/task.listener.js';
import { redis } from './redis.js';
import { postgres } from './postgres.js';
async function startWorker() {
    console.log('Starting Task Worker Service...');

    try {
        await redis.ping();
        console.log('[Connection] Redis connection successful.');
    } catch (e) {
        console.error('[Connection] Could not connect to Redis:', e);
    }

    try {
        await postgres.query('SELECT 1');
        console.log('[Connection] Postgres connection successful.');
    } catch (e) {
         console.error('[Connection] Could not connect to Postgres:', e);
    }


    const taskWorker = await listenToTasks();

    process.on('SIGINT', async () => {
        console.log('[Worker] Worker shutting down...');
        await taskWorker.close();
        process.exit(0);
    });

    console.log('[Worker] Task Worker running...');
}

startWorker().catch(err => {
    console.error('Fatal error starting worker:', err);
    process.exit(1);
});
