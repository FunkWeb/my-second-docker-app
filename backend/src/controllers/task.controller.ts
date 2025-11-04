import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  NotFoundError,
} from 'routing-controllers';
import {postgres} from '../postgres.js';
import {tasksQueue} from '../queues/tasks.queue.js';
import type {Task, TaskAction} from '../types/task.js';

@JsonController('/tasks')
export class TaskController {
  @Get('/')
  async getAllTasks() {
    const result = await postgres.query('SELECT * FROM tasks ORDER BY id');
    return result.rows;
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: number) {
    const result = await postgres.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Task not found');
    }

    return result.rows[0];
  }

  @Post('/')
  @HttpCode(202)
  async createTask(@Body() task: Task) {
    const taskAction: TaskAction = {
      action: 'create',
      data: task,
    };

    await tasksQueue.add('task', taskAction);

    return {message: 'Task creation queued'};
  }

  @Put('/:id')
  @HttpCode(202)
  async updateTask(@Param('id') id: number, @Body() task: Task) {
    const taskAction: TaskAction = {
      action: 'update',
      data: {...task, id},
    };

    await tasksQueue.add('task', taskAction);

    return {message: 'Task update queued'};
  }

  @Delete('/:id')
  @HttpCode(202)
  async deleteTask(@Param('id') id: number) {
    const taskAction: TaskAction = {
      action: 'delete',
      data: {id} as Task,
    };

    await tasksQueue.add('task', taskAction);

    return {message: 'Task deletion queued'};
  }
}
