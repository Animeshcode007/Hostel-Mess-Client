import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentProtectedRoute from './components/student/StudentProtectedRoute';
import ProtectedRoute from "./components/admin/ProtectedRoute";

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 2000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          } 
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
