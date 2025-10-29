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
    const  [submitting, setSubmitting] = useState(false);
    const handleedit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: { title?: string; description?: string } = {};
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        if (trimmedTitle) payload.title = trimmedTitle;
        if (trimmedDescription) payload.description = trimmedDescription;
        if (Object.keys(payload).length === 0) {
            console.log("No changes to update.");
            return;
        }
        try {
            setSubmitting(true)
            await updatetask(id, payload);
            console.log(`Edited task ${id} with`, payload);
            if (onedit) onedit();
        } catch (error) {
            console.error(`Failed to edit task ${id}:`, error);
        }
        finally {
            setSubmitting(false)
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