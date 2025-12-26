import { useEffect, useState, type FunctionComponent } from "react";
import { deleteTicket, getTickets, updateTicketStatus } from "../../api/ticketService";
import { api } from "../../api/api";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Collapse, CircularProgress, MenuItem, Select, TextField, Chip, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getAgents } from "../../api/userService";
import { getCommentsByTicket, addCommentToTicket } from "../../api/commentService";
import type { Ticket } from "../../types/Ticket";
import type { Comment } from "../../types/Comment";
import Comments from "./comments";
import '../../styles/tickets.css';


interface TicketsListProps { }

const TicketsList: FunctionComponent<TicketsListProps> = () => {

    const { state } = useAuth();
    const currentUser = state.user;
    const theme = useTheme();
    const navigate = useNavigate();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [newComment, setNewComment] = useState<Record<number, string>>({});
    const [loadingComments, setLoadingComments] = useState<Record<number, boolean>>({});

    const [agents, setAgents] = useState<{ id: number; name: string }[]>([]);

    const [statusFilter, setStatusFilter] = useState<number | "">("");
    const [priorityFilter, setPriorityFilter] = useState<number | "">("");
    const [assignedToFilter, setAssignedToFilter] = useState<number | "">("");
    const [dateFilter, setDateFilter] = useState<string>("");

    const getStatusName = (statusId: number): string => {
        switch (statusId) {
            case 1: return "Open";
            case 2: return "In Progress";
            case 3: return "Closed";
            default: return "Unknown";
        }
    };

    const getPriorityName = (priorityId: number): string => {
        switch (priorityId) {
            case 1: return "Low";
            case 2: return "Medium";
            case 3: return "High";
            default: return "Unknown";
        }
    };


    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await getTickets();
                setTickets(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);


    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const data = await getAgents();
                setAgents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAgents();
    }, []);


    const loadComments = async (ticketId: number) => {
        setLoadingComments(prev => ({ ...prev, [ticketId]: true }));

        try {
            const data = await getCommentsByTicket(ticketId);
            setComments(prev => ({ ...prev, [ticketId]: data }));
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoadingComments(prev => ({ ...prev, [ticketId]: false }));
        }
    };


    const addComment = async (ticketId: number) => {
        const content = newComment[ticketId]?.trim();
        if (!content)
            return;

        try {
            const data = await addCommentToTicket(ticketId, content);

            setComments(prev => ({
                ...prev,
                [ticketId]: [...(prev[ticketId] || []), data],
            }));

            setNewComment(prev => ({ ...prev, [ticketId]: "" }));
        } catch (err) {
            console.error(err);
        }
    };


    const handleDeleteTicket = async (ticketId: number) => {
        try {
            await deleteTicket(ticketId);
            setTickets(prev => prev.filter(ticket => ticket.id != ticketId));
        } catch (err) {
            console.error(err);
        }
    };


    const toggleExpand = (ticketId: number) => {

        if (expandedTicketId == ticketId) {
            setExpandedTicketId(null);
        } else {
            setExpandedTicketId(ticketId);

            if (!comments[ticketId]) {
                loadComments(ticketId);
            }
        }
    };

    if (loading) {
        return (
            <Box className="loading-spinner">
                <CircularProgress size={60} thickness={4} color="primary" />
                <Typography variant="h6" color="text.secondary">
                    Loading tickets...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }

    if (tickets.length === 0) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                flexDirection: 'column',
                gap: 3
            }}>
                <Alert
                    severity="info"
                    sx={{
                        maxWidth: 400,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexDirection: 'column'
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center",
                            direction: "rtl",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            📭 אין טיקטים להצגה
                        </Typography>

                        <Typography variant="body2">
                            עדיין לא יצרת טיקט. בואו נתחיל עכשיו!
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard/tickets/new")}
                            sx={{ mt: 1 }}
                        >
                            ✨ יצירת טיקט חדש
                        </Button>
                    </Box>
                </Alert>
            </Box>
        );
    }


    const filteredTickets = tickets.filter(ticket => {
        const statusMatch = !statusFilter || ticket.status_id == statusFilter;
        const priorityMatch = !priorityFilter || ticket.priority_id == priorityFilter;
        const assignedMatch = !assignedToFilter || ticket.assigned_to == assignedToFilter;
        const dateMatch = !dateFilter || new Date(ticket.created_at).toISOString().startsWith(dateFilter);

        return statusMatch && priorityMatch && assignedMatch && dateMatch;
    });


    const ticketsByGroup = (() => {
        if (currentUser?.role == "admin" || currentUser?.role == "agent") {
            return filteredTickets.reduce<Record<string, Ticket[]>>((acc, ticket) => {
                const userKey = `${ticket.created_by_name} (${ticket.created_by_email})`;
                if (!acc[userKey])
                    acc[userKey] = [];

                acc[userKey].push(ticket);
                return acc;
            }, {});
        } else {
            return { "": filteredTickets };
        }
    })();

    const getStatusClass = (statusId: number) => {
        switch (statusId) {
            case 1: return 'status-open';
            case 2: return 'status-in-progress';
            case 3: return 'status-closed';
            default: return '';
        }
    };

    const getPriorityClass = (priorityId: number) => {
        switch (priorityId) {
            case 1: return 'priority-low';
            case 2: return 'priority-medium';
            case 3: return 'priority-high';
            default: return '';
        }
    };

    const noTickets = Object.keys(ticketsByGroup).length === 0;


    return (
        <Box className="tickets-container" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            <Card className="filter-section" sx={{ borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: '100%' }}>
                    <Select size="small" value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as number | "")}
                        displayEmpty
                        sx={{ minWidth: 150 }}>
                        <MenuItem value="">All Status</MenuItem>
                        <MenuItem value={1}>🟢 Open</MenuItem>
                        <MenuItem value={2}>🟡 In Progress</MenuItem>
                        <MenuItem value={3}>🔴 Closed</MenuItem>
                    </Select>

                    <Select size="small" value={priorityFilter}
                        onChange={e => setPriorityFilter(e.target.value as number | "")}
                        displayEmpty
                        sx={{ minWidth: 150 }}>
                        <MenuItem value="">All Priorities</MenuItem>
                        <MenuItem value={1}>⬇️ Low</MenuItem>
                        <MenuItem value={2}>➡️ Medium</MenuItem>
                        <MenuItem value={3}>⬆️ High</MenuItem>
                    </Select>

                    {currentUser?.role === "admin" && (
                        <Select size="small"
                            value={assignedToFilter}
                            onChange={e => setAssignedToFilter(e.target.value as number | "")}
                            displayEmpty
                            sx={{ minWidth: 150 }}>
                            <MenuItem value="">All Agents</MenuItem>
                            {agents.map(a => (
                                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                            ))}
                        </Select>
                    )}

                    <TextField
                        size="small"
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        sx={{ minWidth: 150 }}
                    />
                </Box>
            </Card>

            {noTickets && (
                <Alert
                    severity="info"
                    sx={{ maxWidth: 400, mx: "auto", mt: 2, borderRadius: 2 }}
                >
                    📭 לא נמצאו טיקטים תואמים לסינון
                </Alert>
            )}

            {Object.entries(ticketsByGroup).map(([user, userTickets]) => (
                <Box key={user} className="user-group">
                    {user && (
                        <Typography variant="h5" className="user-group-title">
                            👤 {user}
                        </Typography>
                    )}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 2 }}>
                        {userTickets.map(ticket => (
                            <Box key={ticket.id}>
                                <Card
                                    className="ticket-card"
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                                        },
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="h6" className="ticket-title" sx={{ mb: 1 }}>
                                            🎟️ {ticket.subject}
                                        </Typography>

                                        <Typography variant="body2" className="ticket-description">
                                            {ticket.description}
                                        </Typography>

                                        <Box className="ticket-chips" sx={{ mb: 2 }}>
                                            <Chip
                                                label={getStatusName(ticket.status_id)}
                                                size="small"
                                                className={getStatusClass(ticket.status_id)}
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={getPriorityName(ticket.priority_id)}
                                                size="small"
                                                className={getPriorityClass(ticket.priority_id)}
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Box className="ticket-actions">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => toggleExpand(ticket.id)}
                                                sx={{
                                                    borderRadius: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {expandedTicketId === ticket.id ? '▼ פחות' : '▶ פרטים'}
                                            </Button>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDeleteTicket(ticket.id)}
                                                sx={{
                                                    borderRadius: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                🗑️ מחיקה
                                            </Button>
                                        </Box>


                                        <Collapse in={expandedTicketId == ticket.id} sx={{ mt: 2, width: '100%' }}>
                                            <Box className="ticket-details">

                                                <Box className="ticket-detail-item">
                                                    <Typography className="ticket-detail-label">Status:</Typography>
                                                    {(currentUser?.role == "agent" || currentUser?.role === "admin") ? (
                                                        <Select
                                                            size="small"
                                                            value={ticket.status_id}
                                                            onChange={async (e) => {
                                                                const newStatusId = e.target.value as number;
                                                                try {
                                                                    await updateTicketStatus(ticket.id, newStatusId);
                                                                    const refreshedTickets = await getTickets();
                                                                    if (Array.isArray(refreshedTickets)) setTickets(refreshedTickets);
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            sx={{ flex: 1 }}
                                                        >
                                                            <MenuItem value={1}>🟢 Open</MenuItem>
                                                            <MenuItem value={2}>🟡 In Progress</MenuItem>
                                                            <MenuItem value={3}>🔴 Closed</MenuItem>
                                                        </Select>
                                                    ) : (
                                                        <Typography variant="body2">{getStatusName(ticket.status_id)}</Typography>
                                                    )}
                                                </Box>

                                                <Box className="ticket-detail-item">
                                                    <Typography className="ticket-detail-label">Priority:</Typography>
                                                    {currentUser?.role === "admin" ? (
                                                        <Select
                                                            size="small"
                                                            value={ticket.priority_id}
                                                            onChange={async (e) => {
                                                                const newPriorityId = e.target.value as number;
                                                                try {
                                                                    await api(`/tickets/${ticket.id}`, { method: "PATCH", body: JSON.stringify({ priority_id: newPriorityId }) });
                                                                    const refreshedTickets = await getTickets();
                                                                    if (Array.isArray(refreshedTickets)) setTickets(refreshedTickets);
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            sx={{ flex: 1 }}
                                                        >
                                                            <MenuItem value={1}>⬇️ Low</MenuItem>
                                                            <MenuItem value={2}>➡️ Medium</MenuItem>
                                                            <MenuItem value={3}>⬆️ High</MenuItem>
                                                        </Select>
                                                    ) : (
                                                        <Typography variant="body2">{getPriorityName(ticket.priority_id)}</Typography>
                                                    )}
                                                </Box>

                                                <Box className="ticket-detail-item">
                                                    <Typography className="ticket-detail-label">Created by:</Typography>
                                                    <Typography variant="body2">{ticket.created_by_name}</Typography>
                                                </Box>

                                                <Box className="ticket-detail-item">
                                                    <Typography className="ticket-detail-label">Assigned to:</Typography>
                                                    {currentUser?.role === "admin" ? (
                                                        <Select
                                                            size="small"
                                                            value={ticket.assigned_to || ""}
                                                            onChange={async (e) => {
                                                                const newAssignedTo = e.target.value as number;
                                                                try {
                                                                    await api(`/tickets/${ticket.id}`, { method: "PATCH", body: JSON.stringify({ assigned_to: newAssignedTo }) });
                                                                    const refreshedTickets = await getTickets();
                                                                    if (Array.isArray(refreshedTickets)) setTickets(refreshedTickets);
                                                                } catch (err) { console.error(err); }
                                                            }}
                                                            sx={{ flex: 1 }}
                                                        >
                                                            <MenuItem value="">Unassigned</MenuItem>
                                                            {agents.map(agent => <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>)}
                                                        </Select>
                                                    ) : (
                                                        <Typography variant="body2">{ticket.assigned_to_name || "Unassigned"}</Typography>
                                                    )}
                                                </Box>

                                                <Box className="ticket-detail-item">
                                                    <Typography className="ticket-detail-label">Created at:</Typography>
                                                    <Typography variant="body2">{new Date(ticket.created_at).toLocaleString()}</Typography>
                                                </Box>

                                                <Comments
                                                    ticketId={ticket.id}
                                                    comments={comments}
                                                    loadingComments={loadingComments}
                                                    newComment={newComment}
                                                    assignedTo={ticket.assigned_to}
                                                    setNewComment={setNewComment}
                                                    addComment={addComment}
                                                    currentUserRole={currentUser?.role}
                                                />
                                            </Box>
                                        </Collapse>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default TicketsList;