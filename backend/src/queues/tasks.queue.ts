//import {Queue} from 'bullmq';
//import {redis} from '../redis.js';

//const QUEUE_NAME = 'tasks';

//export const tasksQueue = new Queue(QUEUE_NAME, {connection: redis});

import { QueueJobPayload } from '../types/task.js';
export const addTaskJob = async (payload: QueueJobPayload): Promise<void> => {
    console.log('--- Job Queued Successfully ---');
    console.log(`Operation: ${payload.operation}`);
    if (payload.taskId) {
        console.log(`Task ID: ${payload.taskId}`);
    }
    console.log('Data:', payload.data);
    console.log('-------------------------------');
    return Promise.resolve();
};

