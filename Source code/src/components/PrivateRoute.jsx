import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../authContext/authContext";

const PrivateRoute = ({ children, adminOnly = false, userOnly = false }) => {
    const { isAuthenticated, canAccessAdmin, canAccessProfile } = useAuth();


    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !canAccessAdmin()) {
        return <Navigate to="/profile" replace />;
    }

    if (userOnly && !canAccessProfile()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
