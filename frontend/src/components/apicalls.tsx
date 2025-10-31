import { Apirepository } from "./apirepository";

const api = new Apirepository();

const gettaskbyid = (id: string) => api.gettasksbyid(id);
const getalltasks = () => api.getTasks();
const createtask = (task: { title: string; description: string }) => api.createTask(task);
const updatetask = (id: string, updates: { title?: string; description?: string }) => api.updateTask(id, updates);
const deletetask = (id: string) => api.deleteTask(id);

export {
    gettaskbyid,
    getalltasks,
    createtask,
    updatetask,
    deletetask,
};
