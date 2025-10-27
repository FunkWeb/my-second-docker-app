import { Worker, type Job } from 'bullmq';
import { redis } from '../redis.js';
import taskJob from '../jobs/task.job.js';

const QUEUE_NAME = 'tasks';

export default async function listenToTasks() {

    const worker = new Worker(QUEUE_NAME, taskJob, {
        connection: redis,
    });


    worker.on('ready', () => {
        console.log(`[Worker] Listening for jobs on queue: ${QUEUE_NAME}`);
    });

    worker.on('active', (job: Job) => {
        console.log(`[Worker] Job ${job.id} started. Operation: ${job.data.operation}`);
    });

    worker.on('completed', (job: Job, result: unknown) => {

        console.log(`[Worker] Job ${job.id} completed successfully. Result: ${result ?? 'N/A'}`);
    });

    worker.on('failed', (job: Job | undefined, err: Error) => {

        const jobId = job ? job.id : 'Unknown';
        console.error(`[Worker] Job ${jobId} failed with error: ${err.message}`);
        console.error(err);
    });

    worker.on('error', (err: Error) => {

        console.error(`[Worker] General Worker Error:`, err);
    });


    return worker;
}
