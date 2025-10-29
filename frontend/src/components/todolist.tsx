import { useEffect, useState } from "react";
import { getalltasks } from "./apicalls.tsx";
import type {TaskDTO} from "../../type.ts";
const TodoList = () => {
    const [todoList, setTodoList] = useState<TaskDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const tasks = await getalltasks();
                setTodoList(tasks.map((task: TaskDTO) => task.title));
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    if (loading) return <p>Loading tasks...</p>;

    return (
        <div>
            <h2>task List</h2>
            <ul>
                {todoList.map((task, index) => (
                    <li key={index}>
                        <strong>{task.title}</strong>
                        {task.description && <p>{task.description}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
