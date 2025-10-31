import {Job, Worker} from 'bullmq';
import { TaskRepository } from '../repository/task.repository.js';
import {redis} from "../redis";
import {TaskJobData} from "../../types/task.type";

const repository = new TaskRepository();
export default async function taskJob() {
  const worker = new Worker<TaskJobData>(
    'tasks',
    async (job: Job<TaskJobData>) => {
      console.log(`[Listener] Received job ${job.id}:`, job.name, job.data);

      switch (job.name) {
        case 'create':
          console.log('[Listener] Processing create-task...');
          const task = await repository.createTask(job.data.body!);
          console.log('[Listener] Task created:', task);
          break;
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
  return worker;
}
