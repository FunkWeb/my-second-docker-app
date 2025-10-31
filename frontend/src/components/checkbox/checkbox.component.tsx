import type { Task } from '../task/task.types.ts';
import './checkbox.style.css';

export function Checkbox({ task, toggleTask }: { task: Task; toggleTask: (id: number) => void }) {
    
  return (
    <input
      type="checkbox"
      checked={task.status === 'done'}
      onChange={() => toggleTask(task.id)}
      className="checkbox-component"
    />
  );
}
