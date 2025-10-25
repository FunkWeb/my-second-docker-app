import {Queue} from 'bullmq';
import {redis} from '../redis.js';

const QUEUE_NAME = 'tasks';

export const tasksQueue = new Queue(QUEUE_NAME, {connection: redis});
