import type {Job} from 'bullmq';
import {TaskAction} from "../types/task.type";
import {postgres} from '../postgres';

export default async function taskJob(job: Job<TaskAction>) {
  const {action, data} = job.data;

  switch (action) {
    case 'create':
      await postgres.query(
        'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3)',
        [data.title, data.description || null, data.completed || false]
      );
      break;

    case 'update':
      await postgres.query(
        'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4',
        [data.title, data.description || null, data.completed || false, data.id]
      );
      break;

    case 'delete':
      await postgres.query('DELETE FROM tasks WHERE id = $1', [data.id]);
      break;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
