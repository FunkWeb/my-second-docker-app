import {updatetask} from "./apicalls.tsx";
import {useState} from "react";

interface EdittaskProps {
    id: string;
    title?: string;
    description?: string;
    onedit?: () => void;
}
const edittasks = ({ id, title: initialTitle = "", description: initialDescription = "", onedit }: EdittaskProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const handleedit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatetask(id, { title, description });
            console.log(`Edited task ${id} with title: ${title} and description: ${description}`);
            if (onedit) onedit();
        } catch (error) {
            console.error(`Failed to edit task ${id}:`, error);
        }
    };

    return (
        <div>
            <h2>Edit Task</h2>
            <form onSubmit={handleedit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </label>
                <br/>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </label>
                <br/>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default edittasks;