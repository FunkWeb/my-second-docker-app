// backend/src/db/task.queries.ts
import { postgres } from './postgres.js';
import { createTaskQueries } from '../../../shared/db/task.queries.js';

// Create task queries using shared builder
export const taskQueries = createTaskQueries(postgres);

// Re-export types
export type { Task, CreateTaskInput, UpdateTaskInput } from '../../../shared/db/task.queries.js';
