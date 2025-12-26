import type { FunctionComponent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: ("customer" | "agent" | "admin")[];
}

const PrivateRoute: FunctionComponent<PrivateRouteProps> = ({ children, roles }: PrivateRouteProps) => {

    const { state } = useAuth();

    if (state.loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }


    if (!state.user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(state.user.role as "customer" | "agent" | "admin")) {
        return <Navigate to="/notAuthorized" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;