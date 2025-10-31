import type { Task } from '../task/task.types.ts';
import { CheckSquare, Square } from 'lucide-react';

import './checkbox.style.css';

export function Checkbox({ task, toggleTask }: { task: Task; toggleTask: (id: number) => void }) {
    
return (
  <button
    onClick={() => toggleTask(task.id)}
    className="task-toggle-btn"
    >
    {task.status === 'done' ? (
    <CheckSquare size={24} />
    ) : (
    <Square size={24} />
    )}
  </button>
  );              
}
