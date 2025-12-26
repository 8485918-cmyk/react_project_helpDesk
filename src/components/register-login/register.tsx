import { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import "../../styles/auth.css"
import Button from '@mui/material/Button';
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { loginAndStore } from "../../api/authService";
import { Box } from "@mui/system";
import { Alert, IconButton, InputAdornment, TextField } from "@mui/material";


interface RegisterProps {

}

type RegisterData = {
    name: string;
    email: string;
    password: string;
};

const Register: FunctionComponent<RegisterProps> = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({ mode: "all" });

    const [showPassword, setShowPassword] = useState(false);

    const { dispatch } = useAuth();
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");


    const onSubmit = async (data: RegisterData) => {
        setServerError("");
        try {
            await api("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
            });

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
                label="שם מלא"
                fullWidth
                color="secondary"
                {...register("name", {
                    required: "נא למלא שם מלא",
                    minLength: {
                        value: 3,
                        message: "השם חייב להכיל לפחות 3 תווים"
                    }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
            />


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
                    required: "נא למלא סיסמה",
                    minLength: {
                        value: 6,
                        message: "הסיסמה חייבת להכיל לפחות 6 תווים"
                    }
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


            <Button type="submit" variant="contained" sx={{ color: "#fff" }}>
                הרשמה
            </Button>
        </Box>
    );
};



export default Register;