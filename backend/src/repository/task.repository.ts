import {
  createtaskDTO,
  TaskResponseDTO,
  UpdateTaskDTO,
  Task,
  TaskListItemDTO,
  UpdateTaskJob,
  UpdateTaskJobData
} from "../types/task.js";
import {postgres} from "../postgres.js";
import {tasksQueue} from "../queues/tasks.queue.js";
import crypto from "crypto";

export class TaskRepository {
  async createTask(body: createtaskDTO): Promise<TaskResponseDTO> {
    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      status: "queued",
      createdAt: new Date().toISOString(),
    };

    await postgres.query(
      `INSERT INTO tasks (id, title, description, status, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [task.id, task.title, task.description, task.status, task.createdAt]
    );

    await tasksQueue.add("create-task", task, {
      removeOnComplete: true,
      removeOnFail: false,
    });

    return task;
  }

  async update(id: string, updates: UpdateTaskDTO): Promise<TaskResponseDTO | null> {
    const result = await postgres.query<TaskResponseDTO>(
      `UPDATE tasks
       SET title = COALESCE($2, title),
           description = COALESCE($3, description),
           status = COALESCE($4, status)
       WHERE id = $1
         RETURNING
       id,
       title,
       description,
       status,
       created_at as "createdAt",
       ready_at as "readyAt",
       started_at as "startedAt",
       completed_at as "completedAt",
       failed_at as "failedAt",
       result,
       error`,
      [id, updates.title ?? null, updates.description ?? null, updates.status ?? null]
    );

    const task = result.rows[0];
    if (!task) return null;

    const updateJobPayload: UpdateTaskJobData = {
      id,
      body: {
        title: updates.title,
        description: updates.description,
        status: updates.status,
      }
    };

    await tasksQueue.add('update-task', updateJobPayload, {
      removeOnComplete: true,
      removeOnFail: false
    });

    return task;
  }


  async delete(id: string): Promise<void> {
    const result = await postgres.query<Task>(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    const task = result.rows[0];

    if (task) {
      await tasksQueue.add('delete-task', task, {
        removeOnComplete: true,
        removeOnFail: false
      });
    }
  }

  async getbyId(id: string): Promise<TaskResponseDTO | null> {
    const result = await postgres.query<TaskResponseDTO>(`
      SELECT
        id,
        title,
        description,
        status,
        created_at as "createdAt",
        ready_at as "readyAt",
        started_at as "startedAt",
        completed_at as "completedAt",
        failed_at as "failedAt",
        result,
        error
      FROM tasks
      WHERE id = $1
    `, [id]);

    return result.rows[0] ?? null;
  }

  async getAll(): Promise<TaskListItemDTO[]> {
    const result = await postgres.query<TaskListItemDTO>(`
      SELECT
        id,
        title,
        status,
        created_at as "createdAt"
      FROM tasks
      ORDER BY created_at DESC
    `);

    return result.rows;
  }
}
