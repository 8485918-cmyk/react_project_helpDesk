import { api } from "./api";

export const getTickets = async () => {
    const response = await api("/tickets", {
        method: "GET",
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "שגיאה בשליפת טיקטים");
    }

    return response.json();
}


export const updateTicketStatus = async (ticketId: number, status_id: number) => {
    const response = await api(`/tickets/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify({ status_id }),
    });

    if (!response.ok) {
        throw new Error("Failed to update ticket status");
    }
    return response.json();
}



export interface CreateTicketData {
    subject: string;
    description: string;
    priority_id: number;
}

export const createTicket = async (data: CreateTicketData) => {
    const response = await api("/tickets", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "שגיאה ביצירת טיקט");
    }

    return response.json();
}


export const deleteTicket = async (ticketId: number) => {
    const response = await api(`/tickets/${ticketId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete ticket");
    }

    return response.json();
}