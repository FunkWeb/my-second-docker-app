import { useState } from "react";
import {createtask, deletetask, getalltasks, gettaskbyid, updatetask} from "./apicalls.tsx";
import type { TaskJobData } from "../../type.ts";

export const useTasks = () => {
    const [tasks, setTasks] = useState<TaskJobData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = async (fetchFunction: () => Promise<TaskJobData[]> = getalltasks) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchFunction();
            setTasks(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const searchTasks = async (query: string, searchFunction: (query: string) => Promise<TaskJobData[]> = gettaskbyid) => {
        setLoading(true);
        setError(null);
        try {
            const results = await searchFunction(query);
            setTasks(results);
        } catch (err: any) {
            setError(err.message || 'Failed to search tasks');
        } finally {
            setLoading(false);
        }
    };

    const createTaskHandler = async (
        newTask: { title: string; description: string },
        createTaskFn: (task: { title: string; description: string }) => Promise<TaskJobData> = createtask
    ) => {
        setLoading(true);
        setError(null);
        try {
            const createdTask = await createTaskFn(newTask);
            setTasks(prevTasks => [...prevTasks, createdTask]);
        } catch (err: any) {
            setError(err.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };
    const updateTaskHandler = async (
        id: string,
        updates: { title?: string; description?: string },
        updateTaskFn: (id: string, updates: { title?: string; description?: string }) => Promise<TaskJobData> = updatetask
    ) => {
        setLoading(true);
        setError(null);
        try {
            const updatedTask = await updateTaskFn(id, updates);
            setTasks(prev =>
                prev.map(task =>
                    task.type === 'update' && task.id === id ? updatedTask : task
                )
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    const deleteTaskHandler = async (
        id: string,
        deleteTaskFn: (id: string) => Promise<TaskJobData> = deletetask
    ) => {
        setLoading(true);
        setError(null);
        try {
            await deleteTaskFn(id);
            setTasks(prev =>
                prev.filter(task => !(task.type === 'delete' && task.id === id))
            );
        } catch (err: any) {
            setError(err.message || 'Failed to delete task');
        } finally {
            setLoading(false);
        }
    };


    return {
        tasks,
        loading,
        error,
        fetchTasks,
        searchTasks,
        createTaskHandler,
        updateTaskHandler,
        deleteTaskHandler,
    };

};
