import {updatetask} from "./apicalls.tsx";

interface EdittaskProps {
    id: string;
    title?: string;
    description?: string;
    onedit?: () => void;
}
const edittasks = ({ id, title, description, onedit }: EdittaskProps) => {

    const handleedit = async () => {
        try {
           await updatetask(id, { title, description });
            console.log(`Editing task ${id} with title: ${title} and description: ${description}`);

        }
        catch (error) {
            console.error(`Failed to edit task with id ${id}:`, error);
        }
        if (onedit) {
            onedit();
        }
    };
    return (
        <div>
            <h2>Edit Task</h2>
            <form onSubmit={handleedit}>
                <label>
                    Title:
                    <input type="text" defaultValue={title} />
                </label>
                <br />
                <label>
                    Description:
                    <textarea defaultValue={description}></textarea>
                </label>
                <br />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default edittasks;