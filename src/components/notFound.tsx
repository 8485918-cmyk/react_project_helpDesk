import { Box, Button, Typography } from "@mui/material";
import type { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface NotFoundProps { }

const NotFound: FunctionComponent<NotFoundProps> = () => {
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
                <Typography variant="h1" sx={{ fontSize: '5rem', fontWeight: 700, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2 }}>
                    🔍 404
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                    Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/")}
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
                    🏠 Go Home
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.5,
                        px: 4,
                    }}
                >
                    ← Go Back
                </Button>
            </Box>
        </Box>
    );
}

export default NotFound;