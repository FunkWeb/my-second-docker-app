import type { Task } from './task.types.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';

import './task.style.css';

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
}

export default function TaskItem({ task, toggleTask }: TaskItemProps) {
  return (
    <li 
      className={`taskItem ${task.completed ? 'taskItemCompleted' : ''}`}
    >
      <span className="bullet">-</span>
      <span className="taskText">{task.text}</span>
      <Checkbox task={task} toggleTask={toggleTask} />
    </li>
  );
}