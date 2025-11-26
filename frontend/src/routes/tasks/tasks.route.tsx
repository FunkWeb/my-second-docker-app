import { useTasks } from '../../providers/tasks/tasks.provider.tsx';
import { Task } from '../../types/task.ts';
import TaskComponent from '../../components/task/task.component.tsx';
import NewTaskForm from '../../components/tasks/new-task-form.tsx';

export default function Home() {
   const { tasks, isLoading, error, updateTaskStatus, deleteTask, createTask } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);

    const handleStatusChange = (id: number, newStatus: TaskStatus) => {
           updateTaskStatus(id, newStatus);
  };

  const handleDelete = (id: number) => {
            deleteTask(id);
  };

  const handleNewTaskSubmit = (newTaskData: NewTask) => {
      createTask(newTaskData);
      setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container">
        <h2>Tasks Page</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container">
        <h2>Tasks Page</h2>
        <p className="error-message">Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="tasks-page-header">
          <h2>Tasks Page ({tasks.length} Total)</h2>

          {/* Resolved: Add a button to create a New Task (which triggers POST) */}
          <button onClick={() => setIsFormOpen(true)}>
              + Create New Task
          </button>
      </div>

      {/* Conditionally render the New Task form */}
      {isFormOpen && (
          <NewTaskForm
              onSubmit={handleNewTaskSubmit}
              onClose={() => setIsFormOpen(false)}
          />
      )}

      <div className="task-list">
          {/* Map over the tasks array and render a TaskComponent for each */}
          {tasks.length === 0 ? (
              <p>No tasks found. Create one to get started!</p>
          ) : (
              tasks.map((task: Task) => (
                <TaskComponent
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))
          )}
      </div>
    </div>
  );
}
