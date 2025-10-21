import { Queue } from 'bullmq';
import { redis } from '../redis.js';

const QUEUE_NAME = 'tasks';

export const taskQueue = new Queue(QUEUE_NAME, { connection: redis });

// Job type definitions
export interface CreateTaskJob {
  type: 'create';
  data: {
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  };
}

export interface UpdateTaskJob {
  type: 'update';
  data: {
    id: number;
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
  };
}

export interface DeleteTaskJob {
  type: 'delete';
  data: {
    id: number;
  };
}

export type TaskJob = CreateTaskJob | UpdateTaskJob | DeleteTaskJob;
