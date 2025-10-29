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
        if (id) {
            handleDelete(id);
        }

    return <button onClick={() => handleDelete(id)}>Delete</button>;

};
export default deletetasks;
