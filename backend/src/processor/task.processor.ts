// workers/tasks.worker.ts
import {Job, Worker} from 'bullmq';
import {postgres} from "../postgres.js";
import {redis} from "../redis.js";
import {CreateTaskJobData, DeleteTaskJobData, UpdateTaskJobData} from "../types/task.js";


const worker = new Worker(
  'tasks',
  async (job: Job) => {
    switch (job.name) {
      case 'create-task': {
        const data = job.data as CreateTaskJobData;
        await postgres.query(
          'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)',
          [task.id, task.title, task.description, 'processed', task.createdAt]
        );
        break;
      }
      case 'update-task': {
        const data = job.data as UpdateTaskJobData;
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
        const data = job.data as DeleteTaskJobData;
        await postgres.query('DELETE FROM tasks WHERE id = $1', [data.id]);
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
