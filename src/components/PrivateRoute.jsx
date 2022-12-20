import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

export default function PrivateRoute({ children }) {
    let location = useLocation();

    // Auth.currentUser is updated immediately after signup/login function is called
    if (!auth.currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
