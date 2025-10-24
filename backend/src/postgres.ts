//import {Pool} from 'pg';

//const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://pguser:notsecurepassword@localhost:5432/pgdb';

//export const postgres = new Pool({
  //connectionString: DATABASE_URL,
  //max: 10,
  //idleTimeoutMillis: 30_000,
  //connectionTimeoutMillis: 5_000,
//});

import { Task } from './types/task.js';
import { Pool } from 'pg';
// const pool = new Pool(dbConfig);

//get all tasks
export const fetchAllTasks = async (): Promise<Task[]> => {

    console.log('Postgres: Executing SELECT * FROM tasks...');

    const mockTasks: Task[] = [
        { id: 1, title: 'Sett opp Docker Compose', description: 'Fullfør oppsett av postgres, redis, og worker.', status: 'done', created_at: new Date(Date.now() - 86400000), updated_at: new Date(Date.now() - 86400000) },
        { id: 2, title: 'Implementer Task Controller', description: 'Skriv alle 5 API endepunktene.', status: 'in_progress', created_at: new Date(Date.now() - 3600000), updated_at: new Date(Date.now() - 3600000) },
        { id: 3, title: 'Skriv Worker Logikk', description: 'Implementer CRUD for queue jobs.', status: 'todo', created_at: new Date(), updated_at: new Date() },
    ];
    return mockTasks;
};

//get task by id
export const fetchTaskById = async (id: number): Promise<Task | null> => {
    console.log(`Postgres: Executing SELECT * FROM tasks WHERE id = ${id}...`);

    const tasks = await fetchAllTasks();
    const task = tasks.find(t => t.id === id);

    return task || null;
};
