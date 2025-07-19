import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { KeyRound, Loader2 } from "lucide-react";

const ProfileManager = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const formErrors = {};
    if (!currentPassword) formErrors.current = "Current password is required.";
    if (!newPassword) {
      formErrors.new = "New password is required.";
    } else if (newPassword.length < 6) {
      formErrors.new = "Password must be at least 6 characters long.";
    }
    if (newPassword !== confirmPassword) {
      formErrors.confirm = "Passwords do not match.";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };

      const { data } = await axios.put(
        "/api/admin/profile/change-password",
        {
          currentPassword,
          newPassword,
        },
        config
      );

      toast.success(data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full p-2 border rounded-md mt-1 ${
              errors.current ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.current && (
            <p className="text-red-500 text-xs mt-1">{errors.current}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full p-2 border rounded-md mt-1 ${
              errors.new ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.new && (
            <p className="text-red-500 text-xs mt-1">{errors.new}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-2 border rounded-md mt-1 ${
              errors.confirm ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirm && (
            <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>
          )}
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <KeyRound size={20} className="mr-2" />
            )}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManager;
