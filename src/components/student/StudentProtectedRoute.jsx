import React from 'react';
import { Navigate } from 'react-router-dom';

const StudentProtectedRoute = ({ children }) => {
    const studentInfo = localStorage.getItem('studentInfo') 
        ? JSON.parse(localStorage.getItem('studentInfo')) 
        : null;

    if (!studentInfo || !studentInfo.token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default StudentProtectedRoute;