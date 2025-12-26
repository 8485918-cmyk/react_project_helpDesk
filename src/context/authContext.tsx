import type { FunctionComponent } from "react";
import { createContext, useReducer, useContext, type ReactNode, useEffect } from "react";

interface AuthContextProps {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "agent" | "admin";
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
}

export type AuthAction =
    | { type: "LOGIN"; payload: { user: User; token: string; } }
    | { type: "LOGOUT" }
    | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
    user: null,
    token: null,
    loading: true,
};


function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state, user: action.payload.user,
                token: action.payload.token,
                loading: false
            };
        case "LOGOUT":
            return { ...initialState, loading: false };
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextProps>({
    state: initialState,
    dispatch: () => null
});


export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
            dispatch({
                type: "LOGIN",
                payload: {
                    token,
                    user: JSON.parse(user)
                }
            });
        } else {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => useContext(AuthContext);
