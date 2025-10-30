import type { Task } from './task.types.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';

import './task.style.css';

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
}

export default function TaskItem({ task, toggleTask }: TaskItemProps) {
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && !task.completed;
    
    return {
      formatted: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }),
      isOverdue
    };
  };

  const { formatted: dueDate, isOverdue } = formatDueDate(task.due_at);

  const getStatusLabel = (status: Task['status']) => {
    return {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'done': 'Done'
    }[status];
  };

  return (
    <li 
      className={`taskItem ${task.completed ? 'taskItemCompleted' : ''}`}
    >
      <div className="taskHeader">
        <span className="bullet">-</span>
        <div className="taskContent">
          <div className="taskTitleRow">
            <span className="taskText">{task.text}</span>
            <span className={`taskStatus taskStatus--${task.status}`}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          
          {task.description && (
            <p className="taskDescription">{task.description}</p>
          )}
          
          <div className="taskMeta">
            <span className={`taskDueDate ${isOverdue ? 'taskOverdue' : ''}`}>
              {isOverdue}Due: {dueDate}
            </span>
          </div>
        </div>
        <Checkbox task={task} toggleTask={toggleTask} />
      </div>
    </li>
  );
}