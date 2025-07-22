import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/student/login", {
        email,
        password,
      });
      localStorage.setItem("studentInfo", JSON.stringify(data));
      toast.success(`Welcome, ${data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Student Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <p className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-600 block"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-600 block"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Are you an admin?{" "}
          <Link
            to="/admin/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
