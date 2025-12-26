import { api } from "./api";

export interface Comment {
    id: number;
    ticket_id: number;
    author_id: number;
    content: string;
    created_at: string;
    author_name: string;
    author_email: string;
}

export const getCommentsByTicket = async (ticketId: number): Promise<Comment[]> => {
    const response = await api(`/tickets/${ticketId}/comments`, { method: "GET" });

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    return response.json();
};

export const addCommentToTicket = async (ticketId: number, content: string): Promise<Comment> => {
    const response = await api(`/tickets/${ticketId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error("Failed to add comment");
    }

    return response.json();
};
