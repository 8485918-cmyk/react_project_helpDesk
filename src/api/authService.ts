import { api } from "./api";
import { type AuthAction } from "../context/authContext";


export const loginAndStore = async (
    email: string,
    password: string,
    dispatch: React.Dispatch<AuthAction>
) => {
    const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "אירעה שגיאה בשרת");
    }

    const result = await response.json();

    dispatch({
        type: "LOGIN",
        payload: {
            user: result.user,
            token: result.token,
        },
    });

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
};
