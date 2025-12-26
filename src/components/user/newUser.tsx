import { useState, type FunctionComponent } from "react";
import { useAuth } from "../../context/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import type { User } from "../../types/User";
import { createUser } from "../../api/userService";
import { Alert, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Card, CardContent, Typography, Container, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import '../../styles/users.css';

interface NewUserProps { }

const NewUser: FunctionComponent<NewUserProps> = () => {

    const { state } = useAuth();
    const currentUser = state.user;
    const theme = useTheme();
    const navigate = useNavigate();

    if (currentUser?.role != "admin") {
        return <Navigate to="/notAuthorized" replace />;
    }


    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"customer" | "agent" | "admin">("customer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!name || !email || !password || !role) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        const newUser: User = { name, email, password, role };

        try {
            await createUser(newUser);
            setSuccess("User created successfully!");
            setName("");
            setEmail("");
            setPassword("");
            setRole("customer");
            setTimeout(() => navigate("/dashboard/users"), 1500);
        } catch (err: any) {
            setError(err?.message || "An error occurred on the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Card
                sx={{
                    mt: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        ➕ Create New User
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        {error && (
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                {success}
                            </Alert>
                        )}

                        <TextField
                            label="Full Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField
                            label="Email Address"
                            type="email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />

                        <FormControl fullWidth sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}>
                            <InputLabel>User Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                label="User Role"
                            >
                                <MenuItem value="customer">👤 Customer</MenuItem>
                                <MenuItem value="agent">👨‍💼 Agent</MenuItem>
                                <MenuItem value="admin">👨‍💻 Admin</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                            size="large"
                            sx={{
                                mt: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                py: 1.5,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover:not(:disabled)': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(30, 58, 138, 0.2)',
                                },
                                '&:disabled': {
                                    opacity: 0.7,
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "✅ Create User"}
                        </Button>

                        <Button
                            variant="text"
                            onClick={() => navigate("/dashboard/users")}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    backgroundColor: 'rgba(30, 58, 138, 0.04)'
                                }
                            }}
                        >
                            ← Back to Users
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default NewUser;