import type { FunctionComponent } from "react";
import { useAuth } from "../context/authContext";
import { Typography, Box, Container } from "@mui/material";
import Header from "./header";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import '../styles/dashboard.css';

interface DashboardProps { }

const Dashboard: FunctionComponent<DashboardProps> = () => {

    const { state } = useAuth();
    const role = state.user?.role;
    const name = state.user?.name;
    const theme = useTheme();

    return (
        <Box sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
        }}>

            <Header role={role} name={name} />

            <Container
                maxWidth="xl"
                sx={{
                    flex: 1,
                    mt: 4,
                    mb: 4,
                    animation: 'fadeIn 0.5s ease-in-out'
                }}
            >
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 4
                    }}
                >
                    Hello, {name}, Start managing your tickets!
                </Typography>

                <Outlet />
            </Container>
        </Box>
    );
};

export default Dashboard;
