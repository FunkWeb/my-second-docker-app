import { postgres } from "../postgres.js";
import {TaskJobData} from "../types/task.type";

export class TaskRepository {
  async createTask(data: TaskJobData['body']) {
    const id = crypto.randomUUID();
    await postgres.query(
      'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1,$2,$3,$4,NOW())',
      [id, data?.title, data?.description, 'queued']
    );
    return { id, ...data, status: 'queued' };
  }

  async update(id: string, data: Partial<TaskJobData['body']>) {
    const result = await postgres.query(
      'UPDATE tasks SET title=COALESCE($2,title), description=COALESCE($3,description), updated_at=NOW() WHERE id=$1 RETURNING *',
      [id, data?.title ?? null, data?.description ?? null]
    );
    return result.rows[0];
  }

  async delete(id: string) {
    const result = await postgres.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
  }
}
