import { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form"
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { loginAndStore } from "../../api/authService";
import Button from '@mui/material/Button';
import "../../styles/auth.css"
import { Box } from "@mui/system";
import { Alert, IconButton, InputAdornment, TextField } from "@mui/material";


interface LoginProps { }

type LoginData = {
    email: string;
    password: string;
};



const Login: FunctionComponent<LoginProps> = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ mode: "all" });

    const [showPassword, setShowPassword] = useState(false);

    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");


    const onSubmit = async (data: LoginData) => {
        setServerError("");
        try {
            await loginAndStore(data.email, data.password, dispatch);
            navigate("/dashboard");
        } catch (error: any) {
            setServerError(error?.message || "אירעה שגיאה בשרת");
        }
    };



    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <TextField
                label="אימייל"
                fullWidth
                color="secondary"
                {...register("email", {
                    required: "נא למלא אימייל",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "אימייל לא תקין"
                    }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField
                label="סיסמה"
                type={showPassword ? "text" : "password"}
                fullWidth
                color="secondary"
                {...register("password", {
                    required: "נא למלא סיסמה"
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(p => !p)}>
                                {showPassword ? "🙈" : "👁️"}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <Button
                type="submit"
                variant="contained"
                sx={{ color: "#fff" }}
            >
                התחברות
            </Button>
        </Box>
    );
};

export default Login;