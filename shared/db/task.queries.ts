// shared/db/task.queries.ts

import { Pool } from 'pg';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  due_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export const createTaskQueries = (pool: Pool) => ({
  async getAllTasks(): Promise<Task[]> {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async getTaskById(id: number): Promise<Task | null> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async createTask(data: CreateTaskInput): Promise<Task> {
    const { title, description = null, status = 'todo' } = data;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, status]
    );

    return result.rows[0];
  },

  async updateTask(id: number, data: UpdateTaskInput): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);

      // Auto-set completed_at when status changes to 'done'
      if (data.status === 'done') {
        fields.push(`completed_at = NOW()`);
      } else {
        fields.push(`completed_at = NULL`);
      }
    }

    if (fields.length === 0) {
      return this.getTaskById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE tasks
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async deleteTask(id: number): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
});
