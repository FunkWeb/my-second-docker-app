import TaskItem from "../../components/task/task.component";
import { TasksProvider } from "../../providers/tasks/tasks.provider";

const mockTask = {
  id: 1,
  text: "Sample Task",
  completed: false
};

export default function Home() {
  // TODO: implement tasks page
  // TODO: use TasksProvider... how?
  

  const handleToggleTask = (taskId: number) => {
    console.log(`Toggle task ${taskId}`);
  };

  return (
    <div className={"container"}>
      <TasksProvider>
        <TaskItem task={mockTask} toggleTask={handleToggleTask} />
      </TasksProvider>
    </div>
  );
}
