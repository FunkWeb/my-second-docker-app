// workers/tasks.worker.ts
import { Worker } from 'bullmq';
import {postgres} from "../postgres.js";
import {redis} from "../redis.js";


const worker = new Worker(
  'tasks',
  async (job) => {
    switch (job.name) {
      case 'create-task': {
        const { task } = job.data;
        await postgres.query(
          'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)',
          [task.id, task.title, task.description, 'processed', task.createdAt]
        );
        break;
      }
      case 'update-task': {
        const { id, body } = job.data;
        await postgres.query(
          `UPDATE tasks
           SET title = COALESCE($2, title),
               description = COALESCE($3, description),
               status = COALESCE($4, status)
           WHERE id = $1`,
          [id, body.title ?? null, body.description ?? null, body.status ?? null]
        );
        break;
      }
      case 'delete-task': {
        const { id } = job.data;
        await postgres.query('DELETE FROM tasks WHERE id = $1', [id]);
        break;
      }
      default:
        console.log('Unknown job type', job.name);
    }
  },
  { connection: redis }
);

worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
