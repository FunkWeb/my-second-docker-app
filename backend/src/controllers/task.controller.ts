// TODO: write controller for tasks
// backend/src/controllers/task.controller.ts

import { Router, Request, Response } from 'express';
import { taskQueue } from '../queues/tasks.queue.js';
import { createTaskQueries } from '../../../shared/db/task.queries.js';
import { postgres } from '../db/postgres.js';
import type { CreateTaskDTO, UpdateTaskDTO } from '../types/task.js';
7
const router = Router();
const taskQueries = createTaskQueries(postgres);

// GET /api/v1/tasks - Get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const tasks = await taskQueries.getAllTasks();
    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/v1/tasks/:id - Get task by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const task = await taskQueries.getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/v1/tasks - Create new task (queued)
router.post('/', async (req: Request, res: Response) => {
  try {
    const taskData: CreateTaskDTO = req.body;

    // Validate required fields
    if (!taskData.title || taskData.title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (taskData.title.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title must not exceed 200 characters'
      });
    }

    // Validate status if provided
    if (taskData.status && !['todo', 'in_progress', 'done'].includes(taskData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be todo, in_progress, or done'
      });
    }

    // Add job to queue
    const job = await taskQueue.add('create-task', {
      type: 'create',
      data: {
        title: taskData.title.trim(),
        description: taskData.description,
        status: taskData.status || 'todo'
      }
    });

    res.status(202).json({
      success: true,
      message: 'Task creation queued successfully',
      jobId: job.id
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue task creation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/v1/tasks/:id - Update task (queued)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const updateData: UpdateTaskDTO = req.body;

    // Validate at least one field is provided
    if (!updateData.title && !updateData.description && !updateData.status && !updateData.due_at && !updateData.completed_at) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
    }

    // Validate title length if provided
    if (updateData.title !== undefined) {
      if (updateData.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }
      if (updateData.title.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Title must not exceed 200 characters'
        });
      }
    }

    // Validate status if provided
    if (updateData.status && !['todo', 'in_progress', 'done'].includes(updateData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be todo, in_progress, or done'
      });
    }

    // Check if task exists before queuing
    const existingTask = await taskQueries.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    // Add job to queue
    const job = await taskQueue.add('update-task', {
      type: 'update',
      data: {
        id,
        ...updateData
      }
    });

    res.status(202).json({
      success: true,
      message: 'Task update queued successfully',
      jobId: job.id
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue task update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/v1/tasks/:id - Delete task (queued)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    // Check if task exists before queuing
    const existingTask = await taskQueries.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: `Task with ID ${id} not found`
      });
    }

    // Add job to queue
    const job = await taskQueue.add('delete-task', {
      type: 'delete',
      data: {
        id
      }
    });

    res.status(202).json({
      success: true,
      message: 'Task deletion queued successfully',
      jobId: job.id
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to queue task deletion',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
