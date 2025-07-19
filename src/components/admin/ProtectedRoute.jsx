import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const adminInfo = localStorage.getItem('adminInfo') 
        ? JSON.parse(localStorage.getItem('adminInfo')) 
        : null;

    if (!adminInfo || !adminInfo.token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;