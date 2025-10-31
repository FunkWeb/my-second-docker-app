import { useState, useEffect } from 'react';
import type { Task, UpdateTaskDto } from '../../providers/tasks/tasks.types';
import { Trash2 } from 'lucide-react';
import './todays-tasks-list.style.css';
import { Checkbox } from '../checkbox/checkbox.component';

interface TodaysTasksListProps {
  fetchedTasks?: Task[];
  updateTask: (id: number, updates: UpdateTaskDto) => void;
}

export default function TodaysTasksList({ fetchedTasks, updateTask }: TodaysTasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
    if (fetchedTasks) {
      const today = new Date().toISOString().split('T')[0];
      setTasks(fetchedTasks.filter(task => task.due_at.toString().startsWith(today)));
    }
  }, [fetchedTasks]);

  const toggleTask = (id: number) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    )
  );

  const toggled = tasks.find(task => task.id === id);
    if (toggled) {
      const newStatus = toggled.status === 'done' ? 'todo' : 'done';
      updateTask(id, { status: newStatus });
  }
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
              <Checkbox task={task} toggleTask={toggleTask} />
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