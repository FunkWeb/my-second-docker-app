import { useEffect, useState } from "react";
import { getalltasks } from "./apicalls.tsx";

const TodoList = () => {
    const [todoList, setTodoList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const tasks = await getalltasks(); // call your API
                setTodoList(tasks.map((task: any) => task.title));
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
                {todoList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
