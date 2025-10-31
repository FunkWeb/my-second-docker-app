import { useState } from "react";
import {createtask} from "./apicalls.tsx";

interface CreateTaskProps {
    onCreate?: () => void;
}

const CreateTask = ({ onCreate }: CreateTaskProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createtask({ title, description: description || "" });
            console.log("Created task:", title, description);
            setTitle("");
            setDescription("");
            onCreate?.();
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    return (
        <div>
            <h2>Create Task</h2>
            <form onSubmit={handleCreate}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="(optional)"
                    />
                </label>
                <br />
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
};

export default CreateTask;
