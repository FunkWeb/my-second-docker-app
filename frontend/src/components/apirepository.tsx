

const host = import.meta.env.VITE_API_host;

export class Apirepository {

    async getTasks() {
        const response = await fetch(`${host}/api/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
                   const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    throw new Error(`Failed to fetch tasks: ${errorData.message || response.statusText}`);
                }
        const data = await response.json();
        return data;
    }
    async gettasksbyid(id: string) {
        const response = await fetch(`${host}/api/tasks/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data;
    }
    async createTask(task: { title: string; description: string }) {
        const response = await fetch(`${host}api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        const data = await response.json();
        return data;
    }

    async updateTask(id: string, updates: { title?: string; description?: string }) {
        const response = await fetch(`${host}api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        const data = await response.json();
        return data;
    }

    async deleteTask(id: string) {
        const response = await fetch(`${host}/api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Failed to delete task: ${errorData.message || response.statusText}`);
        }
        if (response.status === 204) {
            return { message: 'Task deleted successfully' };
        }
        const data = await response.json();
        return data;
    }
}