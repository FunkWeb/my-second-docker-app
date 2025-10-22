import { Job } from 'bullmq';
import { TaskRepository } from '../repository/task.repository.js';
import {TaskJobData} from "../types/task.type";

const repo = new TaskRepository();

export default async function taskJob(job: Job<TaskJobData>) {
  switch (job.name) {
    case 'create':
      return repo.createTask(job.data.body);
    case 'update':
      return repo.update(job.data.id!, job.data.body);
    case 'delete':
      return repo.delete(job.data.id!);
    default:
      console.log('Unknown job type', job.name);
  }
}
