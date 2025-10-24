// worker/src/workers/task.worker.ts

import { Worker, Job } from 'bullmq';
import { redis } from '../redis.js';
import { postgres } from '../postgres.js';
import { createTaskQueries } from '../../../shared/db/task.queries.js';
import type { TaskJob } from '../../../backend/src/queues/tasks.queue.js';

const taskQueries = createTaskQueries(postgres);

async function processTaskJob(job: Job<TaskJob>) {
  console.log(`Processing task job ${job.id} of type: ${job.data.type}`);

  try {
    switch (job.data.type) {
      case 'create': {
        const task = await taskQueries.createTask(job.data.data);
        console.log(`✅ Task created with ID: ${task.id}`);
        return { success: true, task };
      }

      case 'update': {
        const { id, ...updateData } = job.data.data;
        const task = await taskQueries.updateTask(id, updateData);

        if (!task) {
          console.log(`⚠️ Task ${id} not found`);
          return { success: false, message: 'Task not found' };
        }

        console.log(`✅ Task ${id} updated successfully`);
        return { success: true, task };
      }

      case 'delete': {
        const { id } = job.data.data;
        const deleted = await taskQueries.deleteTask(id);

        if (!deleted) {
          console.log(`⚠️ Task ${id} not found for deletion`);
          return { success: false, message: 'Task not found' };
        }

        console.log(`✅ Task ${id} deleted successfully`);
        return { success: true, deletedId: id };
      }

      default:
        throw new Error(`Unknown job type: ${(job.data as any).type}`);
    }
  } catch (error) {
    console.error(`❌ Error processing job ${job.id}:`, error);
    throw error;
  }
}

export const taskWorker = new Worker('tasks', processTaskJob, {
  connection: redis,
  concurrency: 5,
});

taskWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

taskWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

taskWorker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('✅ Task worker started and listening for jobs...');
