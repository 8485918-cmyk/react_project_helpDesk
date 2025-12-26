import { Box, Button, Typography } from "@mui/material";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface NotAuthorizedProps { }

const NotAuthorized: FunctionComponent<NotAuthorizedProps> = () => {

    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, color: theme.palette.error.main, mb: 2 }}>
                    🚫 403
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                    Sorry, you don't have permission to access this page. Please check your role or contact an administrator.
                </Typography>
            </Box>

            <Button
                variant="contained"
                size="large"
                onClick={() => navigate(-1)}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(30, 58, 138, 0.2)',
                    }
                }}
            >
                ← Go Back
            </Button>
        </Box>
    );

}

export default NotAuthorized;