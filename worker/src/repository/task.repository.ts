import { postgres } from "../postgres.js";
import {TaskJobData} from "../types/task.type";

export class TaskRepository {
  async createTask(data: TaskJobData['body']) {
    const id = crypto.randomUUID();
    console.log('[Repository] Inserting task into DB:', data);

    const result = await postgres.query(
      `INSERT INTO tasks (id, title, description, status, created_at)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, data!.title, data!.description || '', 'todo', new Date().toISOString()]
    );



    console.log('[Repository] Insert result:', result.rows[0]);
    return result.rows[0];
  }

  async update(id: string, data: Partial<TaskJobData['body']>) {
    console.log('[Repository] Updating task:', id, data);

    const result = await postgres.query(
      `UPDATE tasks SET title = COALESCE($2, title),
                         description = COALESCE($3, description),
                         updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, data?.title ?? null, data?.description ?? null]
    );

    console.log('[Repository] Update result:', result.rows[0]);
    return result.rows[0];
  }

  async delete(id: string) {
    console.log('[Repository] Deleting task:', id);

    const result = await postgres.query(
      'DELETE FROM tasks WHERE id=$1 RETURNING *',
      [id]
    );

    console.log('[Repository] Delete result:', result.rows[0]);
    return result.rows[0];
  }
}
