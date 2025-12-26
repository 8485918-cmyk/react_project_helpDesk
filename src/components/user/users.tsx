import { useEffect, useState, type FunctionComponent } from "react";
import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";
import { getUsers } from "../../api/userService";
import type { User } from "../../types/User";
import { Card, CardContent, CircularProgress, Typography, Container, Box, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import '../../styles/users.css';

interface UsersProps { }

const Users: FunctionComponent<UsersProps> = () => {
    const { state } = useAuth();
    const currentUser = state.user;
    const theme = useTheme();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    if (currentUser?.role != "admin") {
        return <Navigate to="/notAuthorized" replace />;
    }


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (err: any) {
                setError(err?.message || "Error fetching users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                    gap: 2,
                }}
            >
                <CircularProgress size={60} thickness={4} color="primary" />
                <Typography variant="h6" color="text.secondary">
                    Loading users...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }


    if (users.length == 0) {
        return (
            <Container>
                <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    📭 No users to display
                </Alert>
            </Container>
        );
    }


    const customers = users.filter(user => user.role == 'customer');
    const agents = users.filter(user => user.role == 'agent');
    const admins = users.filter(user => user.role == 'admin');


    const renderUserCard = (user: User, color: string) => (
        <Card
            key={user.id}
            className="user-item"
            sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: color,
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Typography className="user-name">
                    👤 {user.name}
                </Typography>
                <Typography className="user-email">
                    ✉️ {user.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                        Role:
                    </Typography>
                    <span className={`user-role ${user.role}`}>
                        {user.role === 'customer' && '👥 Customer'}
                        {user.role === 'agent' && '👨‍💼 Agent'}
                        {user.role === 'admin' && '👨‍💻 Admin'}
                    </span>
                </Box>
            </CardContent>
        </Card>
    );

    const renderGroup = (
        title: string,
        icon: string,
        color: string,
        group: User[],
        variant: 'customer' | 'agent' | 'admin'
    ) => (
        <Box key={variant} className="user-group-card" sx={{ mb: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '1.5rem',
                    color: '#1e293b'
                }}
            >
                {icon} {title}
                <Typography
                    component="span"
                    sx={{
                        ml: 'auto',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#64748b',
                        backgroundColor: color,
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                    }}
                >
                    {group.length} {group.length === 1 ? 'user' : 'users'}
                </Typography>
            </Typography>

            {group.length === 0 ? (
                <Box className="empty-state">
                    <Typography sx={{ fontStyle: 'italic', color: '#94a3b8' }}>
                        No users in this category
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    gap: 2
                }}>
                    {group.map((user) => (
                        <Box key={user.id}>
                            {renderUserCard(user, color)}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );

    return (
        <Container maxWidth="lg" className="users-container" sx={{ py: 2 }}>
            <Typography
                variant="h3"
                sx={{
                    mb: 4,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                👥 Manage Users
            </Typography>

            {renderGroup("Customers", "👤", "#def7feff", customers, 'customer')}
            <br /><br /><hr /><br /><br />
            {renderGroup("Agents", "👨‍💼", "#ffd9fdff", agents, 'agent')}
            <br /><br /><hr /><br /><br />
            {renderGroup("Admins", "👨‍💻", "#fff0d7ff", admins, 'admin')}
        </Container>
    );
};

export default Users;