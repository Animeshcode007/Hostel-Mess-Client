import React, { useState } from "react";
import axios from "axios";

const RaiseIssueForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.post("/api/issues", { title, description });

      setSuccess(data.message || "Your issue has been submitted successfully!");
      setTitle("");
      setDescription("");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit issue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
      {error && (
        <p className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </p>
      )}
      {success && (
        <p className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
          {success}
        </p>
      )}

      <div>
        <label
          htmlFor="issue-title"
          className="block text-sm font-medium text-white"
        >
          Issue Title
        </label>
        <input
          type="text"
          id="issue-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Food Quality, Cleanliness"
          className="w-full p-2 mt-1 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="issue-description"
          className="block text-sm font-medium text-white"
        >
          Description
        </label>
        <textarea
          id="issue-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please provide details about the issue."
          className="w-full p-2 mt-1 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          required
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-6 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 disabled:bg-red-400 transition-colors"
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </div>
    </form>
  );
};

export default RaiseIssueForm;
