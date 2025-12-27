import { api } from "./api"

export const getStatuses = async () => {
    const res = await api("/statuses");
    if (!res.ok)
        throw new Error("Faild to fetch statuses");
    return res.json();
};



export const getPriorities = async () => {
    const res = await api("/priorities");
    if (!res.ok)
        throw new Error("Faild to fetch priorities");
    return res.json();
}