import {deletetask} from "./apicalls.tsx";

interface DeleteTasksProps {
    id: string;
    ondelete?: () => void;
}
const deletetasks = ({ id }: DeleteTasksProps) => {

    const handleDelete = async (taskId: string) => {
        try {
            await deletetask(taskId);
            console.log(`Task with id ${taskId} deleted successfully.`);
        } catch (error) {
            console.error(`Failed to delete task with id ${taskId}:`, error);
        }
    }
    return (
        <button
            onClick={() => {
                if (id && window.confirm("Are you sure you want to delete this task?")) {
                    handleDelete(id);
                }
            }}
        >
            Delete
        </button>
    );
};
export default deletetasks;
