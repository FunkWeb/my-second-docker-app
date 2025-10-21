import { Job } from 'bullmq';
import {Task} from "../types/task.type";

export default async function taskJob(job: Job<Task>) {
  console.log(`[taskJob] Processing task: ${job.data.title}`);

  const { id, title, description } = job.data;
  const result = {
    message: `Task "${title}" completed successfully`,
    taskId: id,
    processedAt: new Date().toISOString(),
    description: description || null,
  };

  console.log(`[taskJob] Finished: ${title}`);

  return result;
}
