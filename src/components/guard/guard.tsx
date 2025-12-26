import type { FunctionComponent, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface GuardProps {
    children: ReactNode;
}

const Guard: FunctionComponent<GuardProps> = ({ children }: GuardProps) => {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default Guard;