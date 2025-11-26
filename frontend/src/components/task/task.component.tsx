
import { Task } from '../../types/task.ts';

interface TaskComponentProps {
  task: Task;
  onUpdateStatus: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

export default function TaskComponent({ task, onUpdateStatus, onDelete }: TaskComponentProps) {
  const isDone = task.status === 'done';

  return (
    <div className={`task-card ${isDone ? 'completed' : task.status}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>

      <div className="task-meta">
        <span>Status: <strong>{task.status}</strong></span>
        {task.due_at && <span>Due: {new Date(task.due_at).toLocaleDateString()}</span>}
      </div>

      <div className="task-actions">
        {}
        {!isDone && (
          <button onClick={() => onUpdateStatus(task.id, 'done')}>
            Mark as Done
          </button>
        )}
        <button onClick={() => onDelete(task.id)} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}
