import { JsonController, Get, Post, Put, Delete, Param, Body, HttpCode, NotFoundError, BadRequestError } from 'routing-controllers';
import { tasksQueue } from '../queues/tasks.queue.js';
import { postgres } from '../postgres.js';

@JsonController('/task')
export class TaskController {
  @Get('s/')
  async getAllTasks() {
    const result = await postgres.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );

    return {
      success: true,
      data: result.rows
    };
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: bigint) {
    const result = await postgres.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task not found');
    }

    return {
      success: true,
      data: result.rows[0]
    };
  }

  @Post('/')
  @HttpCode(201)
  async createTask(@Body() body: { title: string; description?: string }) {
    const { title, description } = body;

    if (!title) {
      throw new BadRequestError('Title is required');
    }

    const job = await tasksQueue.add('create-task', {
      title,
      description: description || ''
    });

    return {
      success: true,
      jobId: job.id
    };
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: bigint,
    @Body() body: { title?: string; description?: string; status?: string }
  ) {
    const job = await tasksQueue.add('update-task', {
      id,
      ...body
    });

    return {
      success: true,
      jobId: job.id
    };
  }

  @Delete('/:id')
  @HttpCode(202)
  async deleteTask(@Param('id') id: bigint) {
    const job = await tasksQueue.add('delete-task', { id });

    return {
      success: true,
      jobId: job.id
    };
  }
}
