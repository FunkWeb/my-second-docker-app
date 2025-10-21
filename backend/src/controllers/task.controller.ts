import { JsonController, Get, Post, Put, Delete, Param, Body, HttpCode, NotFoundError, BadRequestError } from 'routing-controllers';
import { postgres } from '../postgres.js';

@JsonController('/tasks')
export class TaskController {
  @Get('/')
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
  async getTaskById(@Param('id') id: string) {
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

    const result = await postgres.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description || '', 'todo']
    );

    return {
      success: true,
      data: result.rows[0]
    };
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; completed?: boolean }
  ) {
    const { title, description, completed } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (completed !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(completed ? 'completed' : 'pending');
    }

    if (updates.length === 0) {
      throw new BadRequestError('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await postgres.query(
      `UPDATE tasks
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task not found');
    }

    return {
      success: true,
      data: result.rows[0]
    };
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    const result = await postgres.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Task not found');
    }

    return {
      success: true,
      message: 'Task deleted successfully'
    };
  }
}
