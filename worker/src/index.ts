import listenToTasks from './listeners/task.listener.js';
import listenToPings from './listeners/ping.listener.js';

import { redis } from './redis.js';
import { postgres } from './postgres.js';
import { Worker } from 'bullmq';

async function startWorker() {
    console.log('Starting All Workers Service...');

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

    const taskWorker: Worker = await listenToTasks();
    console.log('[Worker] Task Worker running...');

    const pingWorker: Worker = await listenToPings();
    console.log('[Worker] Ping Worker running...');

    process.on('SIGINT', async () => {
        console.log('[Worker] Workers shutting down...');
        await taskWorker.close();
        await pingWorker.close();

        console.log('[Worker] Workers shut down successfully.');
        process.exit(0);
    });

    console.log('[Service] Worker service fully operational.');
}

startWorker().catch(err => {
    console.error('Fatal error starting worker:', err);
    process.exit(1);
});
