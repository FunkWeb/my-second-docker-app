import { Worker, Job } from 'bullmq';
import { redis } from '../redis.js';
import { TaskRepository } from '../repository/task.repository.js';
import {TaskJobData} from "../../../shared/types";


export default function listenToTasks() {
  const repository = new TaskRepository();

  const worker = new Worker<TaskJobData>(
    'tasks',
    async (job: Job<TaskJobData>) => {
      console.log(`[Listener] Received job ${job.id}:`, job.name, job.data);

      switch (job.data.type) {
        case 'create': {
          console.log('[Worker] Processing create...');
          const task = await repository.createTask(job.data.body);
          console.log('[Worker] Created task:', task);
          break;
        }
        case 'update':
          console.log('[Listener] Processing update-task...');
          const updated = await repository.update(job.data.id!, job.data.body!);
          console.log('[Listener] Task updated:', updated);
          break;
        case 'delete':
          console.log('[Listener] Processing delete-task...');
          const deleted = await repository.delete(job.data.id!);
          console.log('[Listener] Task deleted:', deleted);
          break;
        default:
          console.warn('[Listener] Unknown job type:', job.name);
      }
    },
    { connection: redis }
  );

  worker.on('completed', (job) => console.log(`[Listener] Job ${job.id} completed`));
  worker.on('failed', (job, err) => console.error(`[Listener] Job ${job?.id} failed:`, err));

  return worker;
}
