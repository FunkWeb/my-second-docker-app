import {useEffect} from "react";
import TodaysTasksList from "../../components/todays-tasks-list/todays-tasks-list.component";
import { useTasksContext } from "../../providers/tasks/tasks.context";
import { TasksProvider } from "../../providers/tasks/tasks.provider";
import type { Task } from "../../providers/tasks/tasks.types";

function HomeContent() {
  const { tasks, loading, error, fetchTasks, updateTask } = useTasksContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className={"container"}>
      <TodaysTasksList fetchedTasks={tasks as Task[]} />
    </div>
  );
}

export default function Home() {
  return (
    <TasksProvider>
      <HomeContent />
    </TasksProvider>
  );
}