import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskCreateDTO, TaskUpdateDTO } from '../../types/task.type';
import * as TaskService from '../../services/task.service';
interface TaskContextType {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    refreshTasks: () => void;
    handleCreateTask: (data: TaskCreateDTO) => Promise<void>;
    handleUpdateTask: (taskId: number, data: TaskUpdateDTO) => Promise<void>;
    handleDeleteTask: (taskId: number) => Promise<void>;
}

const initialContext: TaskContextType = {
    tasks: [],
    isLoading: false,
    error: null,
    refreshTasks: () => {}, // Tom funksjon som placeholder
    handleCreateTask: () => Promise.resolve(),
    handleUpdateTask: () => Promise.resolve(),
    handleDeleteTask: () => Promise.resolve(),
};

export const TaskContext = createContext<TaskContextType>(initialContext);
export const useTasks = () => useContext(TaskContext);
