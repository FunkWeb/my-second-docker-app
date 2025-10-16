import {Queue} from 'bullmq';
import {redis} from '../redis.js';

const QUEUE_NAME = 'ping';

export const pingQueue = new Queue(QUEUE_NAME, {connection: redis});
