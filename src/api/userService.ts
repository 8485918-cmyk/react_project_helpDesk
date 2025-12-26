import type { User } from "../types/User";
import { api } from "./api";


export const getAgents = async () => {
    const response = await api("/users", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch agents");
    }

    const users = await response.json();
    return users.filter((user: any) => user.role == "agent");
}


export const getUsers = async () => {
    const response = await api("/users", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }

    return await response.json();
}


export const createUser = async (user: User) => {
    try {
        const response = await api("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("Failed to create user");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}