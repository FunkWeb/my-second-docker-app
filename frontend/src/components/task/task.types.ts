import { Task } from '../../types/task';
export interface TaskComponentProps {
    task: Task;

    onStatusChange: (taskId: number, newStatus: TaskStatus) => void;

    onEdit: (task: Task) => void;

    onDelete: (taskId: number) => void;
}
