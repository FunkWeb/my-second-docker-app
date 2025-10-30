import { useState, useEffect } from 'react';
import TaskItem from "../../components/task/task.component";
import { TasksProvider } from "../../providers/tasks/tasks.provider";
import { useTasksContext } from "../../providers/tasks/tasks.context";
import { CreateTaskModal } from '../../components/create-task-modal/create-task-modal.components';
import { Button } from "../../components/button/button.component";

function TasksContent() {
  const { tasks, loading, error, fetchTasks, updateTask } = useTasksContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'done' ? 'todo' : 'done';
      await updateTask(taskId, { status: newStatus });
      console.log(`Toggled task ${taskId} to status ${newStatus}`);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Tasks</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Create Task
        </Button>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>No tasks yet. Create your first task!</p>
      )}

      {tasks.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={{
                id: task.id,
                text: task.title,
                description: task.description,
                due_at: task.created_at,
                status: task.status,
                completed: task.status === 'done'
              }}
              toggleTask={handleToggleTask}
            />
          ))}
        </ul>
      )}

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function Tasks() {
  return (
    <TasksProvider>
      <TasksContent />
    </TasksProvider>
  );
}