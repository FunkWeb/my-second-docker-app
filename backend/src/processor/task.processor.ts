// workers/tasks.worker.ts
import { Job, Worker } from 'bullmq';
import { redis } from '../redis.js';
import { CreateTaskJobData, DeleteTaskJobData, UpdateTaskJobData } from '../types/task.js';
import {TaskRepository} from "../repository/task.repository.js";

const repository = new TaskRepository();

const worker = new Worker(
  'tasks',
  async (job: Job) => {
    switch (job.name) {
      case 'create-task': {
        const data = job.data as CreateTaskJobData;
        await repository.createTask({
          title: data.task.title,
          description: data.task.description,
        });
        break;
      }
      case 'update-task': {
        const data = job.data as UpdateTaskJobData;
        await repository.update(data.id, data.body);
        break;
      }
      case 'delete-task': {
        const data = job.data as DeleteTaskJobData;
        await repository.delete(data.id);
        break;
      }
      default:
        console.log('Unknown job type:', job.name);
    }
  },
  { connection: redis }
);

worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));
