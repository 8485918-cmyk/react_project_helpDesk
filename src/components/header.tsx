import { useEffect, useState, type FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddStatusDialog from "./addStatusDialog";
import AddPriorityDialog from "./addPriorityDialog";
import { api } from "../api/api";



interface HeaderProps {
    role: "customer" | "agent" | "admin" | undefined;
    name: string | undefined;
}

const Header: FunctionComponent<HeaderProps> = ({ role, name }) => {

    const navigate = useNavigate();
    const theme = useTheme();

    const [openStatus, setOpenStatus] = useState(false);
    const [openPriority, setOpenPriority] = useState(false);

    const [priorities, setPriorities] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);


    const fetchPriorities = async () => {
        try {
            const res = await api("/priorities");
            const data = await res.json();
            setPriorities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStatuses = async () => {
        try {
            const res = await api("/statuses");
            const data = await res.json();
            setStatuses(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPriorities();
        fetchStatuses();
    }, []);
    const buttons: { label: string, path: string }[] = [];

    if (role == "customer") {
        buttons.push(
            { label: "✏️ Create New Ticket", path: "/dashboard/tickets/new" },
            { label: "📋 My Tickets", path: "/dashboard/tickets" }
        );
    } else if (role == "agent") {
        buttons.push(
            { label: "🎯 Assigned Tickets", path: "/dashboard/tickets" }
        );
    } else if (role == "admin") {
        buttons.push(
            { label: "📊 All Tickets", path: "/dashboard/tickets" },
            { label: "👥 All Users", path: "/dashboard/users" },
            { label: "➕ Create User", path: "/dashboard/users/new" }
        );
    }
    buttons.push({ label: "🚪 Logout", path: "/login" });

    return (
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 2, px: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: '1.5rem'
                        }}
                    >
                        🎟️ Helpdesk
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" sx={{ mr: 3, fontWeight: 500 }}>
                        👋 Welcome, {name || "User"}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {role === "admin" && (
                            <>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenPriority(true)}
                                >
                                    ➕ Create Priority
                                </Button>

                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenStatus(true)}
                                >
                                    ➕ Create Status
                                </Button>
                            </>
                        )}

                        {buttons.map((btn, index) => (
                            <Button
                                key={index}
                                variant={btn.label.includes("Logout") ? "outlined" : "contained"}
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.875rem',
                                    ...(btn.label.includes("Logout") && {
                                        color: '#fff',
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderColor: '#fff',
                                        }
                                    })
                                }}
                                onClick={() => navigate(btn.path)}
                            >
                                {btn.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Toolbar>
            <AddPriorityDialog
                open={openPriority}
                onClose={() => setOpenPriority(false)}
                onCreated={fetchPriorities}
            />

            <AddStatusDialog
                open={openStatus}
                onClose={() => setOpenStatus(false)}
                onCreated={fetchStatuses}
            />

        </AppBar>
    );
};

export default Header;