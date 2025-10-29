import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import { Task, TaskCreateDTO, TaskUpdateDTO } from '../../types/task.type';
import * as TaskService from '../../services/task.service';
import { TaskContext } from './task.context.tsx';

interface TaskProviderProps {
    children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await TaskService.fetchTasks();
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err instanceof Error ? err.message : 'Unknown error during fetch.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    const handleCreateTask = async (data: TaskCreateDTO) => {
        setError(null);
        try {
            await TaskService.createTask(data);
            alert('Task creation request accepted (queued). Refreshing list soon...');
            setTimeout(refreshTasks, 2000);
        } catch (err) {
            console.error('Error creating task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error during creation.');
            throw err;
        }
    };

    const handleUpdateTask = async (taskId: number, data: TaskUpdateDTO) => {
        setError(null);
        try {
            await TaskService.updateTask(taskId, data);
            alert(`Task ID ${taskId} update request accepted (queued). Refreshing list soon...`);
            setTimeout(refreshTasks, 2000);
        } catch (err) {
            console.error('Error updating task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error during update.');
            throw err;
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        setError(null);
        try {
            await TaskService.deleteTask(taskId);
            alert(`Task ID ${taskId} delete request accepted (queued). Refreshing list soon...`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            setTimeout(refreshTasks, 2000);
        } catch (err) {
            console.error('Error deleting task:', err);
            setError(err instanceof Error ? err.message : 'Unknown error during deletion.');
            throw err;
        }
    };

    const contextValue = {
        tasks,
        isLoading,
        error,
        refreshTasks,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
    };

    return (
        <TaskContext.Provider value={contextValue}>
            {children}
        </TaskContext.Provider>
    );
};
