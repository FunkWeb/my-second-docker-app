import { useState, useEffect } from 'react';
import type { Task } from '../../providers/tasks/tasks.types';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import './todays-tasks-list.style.css';

interface TodaysTasksListProps {
  fetchedTasks?: Task[];
}

export default function TodaysTasksList({ fetchedTasks }: TodaysTasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.status === 'done').length;
  const totalCount = tasks.length;

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2 className="tasks-title">Today's Tasks</h2>
        <p className="tasks-progress-text">
          {completedCount} of {totalCount} completed
        </p>
        <div className="progress-bar-background">
          <div 
            className="progress-bar-fill"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="tasks-empty">No tasks yet :( </p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <button
                onClick={() => toggleTask(task.id)}
                className="task-toggle-btn"
              >
                {task.status === 'done' ? (
                  <CheckCircle2 size={24} className="icon-completed" />
                ) : (
                  <Circle size={24} />
                )}
              </button>

              <span className={`task-text ${task.status === 'done' ? 'task-text-completed' : ''}`}>
                {task.title}
              </span>
              
              <button
                onClick={() => deleteTask(task.id)}
                className="task-delete-btn"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}