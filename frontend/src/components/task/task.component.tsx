import { useState } from 'react';
import type { Task } from './task.types.ts';
import { Checkbox } from '../checkbox/checkbox.component.tsx';

import './task.style.css';


export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Do the laundry', completed: false },
    { id: 2, text: 'Clean the kitchen', completed: false },
    { id: 3, text: 'Drink water', completed: false },
    { id: 4, text: 'Do a backflip', completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const totalTasks = 13;
  const completedThisWeek = 7;

  return (
    <div className="task-container">
      <h1 className="task-heading">TODAY'S TASKS</h1>

      <ul className="taskList">
        {tasks.map(task => (
          <li 
            key={task.id} 
            className={`taskItem ${task.completed ? 'taskItemCompleted' : ''}`}
          >
            <span className="bullet">-</span>
            <span className="taskText">{task.text}</span>
            <Checkbox task={task} toggleTask={toggleTask} />
          </li>
        ))}
      </ul>

      <div className="task-statsContainer">
        <p className="task-statsText">TOTAL TASKS ({totalTasks})</p>
      </div>

      <div className="task-statsContainer">
        <p className="task-statsText">COMPLETED TASKS THIS WEEK ({completedThisWeek})</p>
      </div>
    </div>
  );
}

