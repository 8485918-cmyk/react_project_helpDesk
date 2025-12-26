import { useState, type FunctionComponent } from "react";
import Register from "./register";
import Login from "./login";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import "../../styles/auth.css";

interface AuthProps { }

const Auth: FunctionComponent<AuthProps> = () => {

    localStorage.clear();

    const [isRegister, setIsRegister] = useState(false);
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3
            }}
        >
            <Box
                className="container"
                sx={{
                    maxWidth: 420,
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                    border: `1px solid ${theme.palette.divider}`,
                    p: 4,
                    animation: 'slideInUp 0.6s ease-out'
                }}
            >
                <h1>🎟️ Helpdesk</h1>
                <h2>מערכת לניהול טיקטים</h2>

                <Box className="switchContainer" sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <button
                        className={`switchButton ${isRegister ? 'activeButton' : ''}`}
                        onClick={() => setIsRegister(true)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 8,
                            border: 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: isRegister ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : 'transparent',
                            color: isRegister ? '#fff' : '#64748b'
                        }}
                    >
                        📝 הרשמה
                    </button>
                    <button
                        className={`switchButton ${!isRegister ? 'activeButton' : ''}`}
                        onClick={() => setIsRegister(false)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 8,
                            border: 'none',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            backgroundColor: !isRegister ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)` : 'transparent',
                            color: !isRegister ? '#fff' : '#64748b'
                        }}
                    >
                        🔓 התחברות
                    </button>
                </Box>

                {isRegister ? <Register /> : <Login />}
            </Box>
        </Box>
    );

}
export default Auth;
