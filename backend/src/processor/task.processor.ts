import { Worker, Job } from 'bullmq';
import { redis } from '../redis.js';
import { TaskRepository } from '../../../worker/src/repository/task.repository.js';
import {Task} from "../types/task.js";

const repository = new TaskRepository();

export default function listenToBackendTasks() {
  const worker = new Worker<Task>(
    'tasks',
    async (job: Job<Task>) => {
      const task = job.data;

      switch (job.name) {
        case 'create-task':
          console.log('[taskJob] Processing task:', task.title);
          await repository.createTask(task);
          console.log('[taskJob] Finished:', task.title);
          break;

        case 'update-task':
          console.log('[taskJob] Updating task:', task.id);
          await repository.update(task.id, task);
          break;

        case 'delete-task':
          console.log('[taskJob] Deleting task:', task.id);
          await repository.delete(task.id);
          break;

        default:
          console.log('Unknown job type:', job.name);
      }
    },
    { connection: redis }
  );

  worker.on('ready', () => console.log('[tasks] Worker ready'));
  worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`Job ${job?.id} failed: ${err.message}`));

  return worker;
}
