import { Controller, Post, Body, Get, Param, HttpError, Delete, Put } from 'routing-controllers';
import { Task } from '../types/task.js';
import crypto from 'crypto';
import {tasksQueue} from "../queues/tasks.queue.js";
import {postgres} from "../postgres.js";

@Controller('/tasks')
export default class TaskController {
  @Post('/')
  async createTask(@Body() body: { title: string; description: string }) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
    await postgres.query(
      'INSERT INTO tasks (id, title, description, status, created_at) VALUES ($1, $2, $3, $4, $5)',
      [task.id, task.title, task.description, task.status, task.createdAt]
    );
    await tasksQueue.add('process-task', task, {
      removeOnComplete: true,
      removeOnFail: false,
    });

    return task;
  }

  @Get('/')
  async getAllTasks() {
    const result = await postgres.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  }

  @Get('/:id')
  async getTask(@Param('id') id: string) {
    const result = await postgres.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new HttpError(404, 'Task not found');
    }

    return result.rows[0];
  }


  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    const result = await postgres.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      throw new HttpError(404, 'Task not found');
    }
    const task: Task = result.rows[0];
    await tasksQueue.add('process-task', task, {
      removeOnComplete: true,
      removeOnFail: false,
    });
    return result.rows[0];
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description: string; status: string }>
  ) {
    const result = await postgres.query(
      `UPDATE tasks
       SET title       = COALESCE($2, title),
           description = COALESCE($3, description),
           status      = COALESCE($4, status)
       WHERE id = $1 RETURNING *`,
      [id, body.title ?? null, body.description ?? null, body.status ?? null]
    );
    const task: Task = result.rows[0];
    await tasksQueue.add('process-task', task, {
      removeOnComplete: true,
      removeOnFail: false,
    });
    if (result.rows.length === 0) {
      throw new HttpError(404, 'Task not found');
    }
    return result.rows[0];

  }
}
