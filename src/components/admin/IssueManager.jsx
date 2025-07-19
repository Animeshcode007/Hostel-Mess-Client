import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

const IssueManager = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };
      const { data } = await axios.get("/api/issues", config);
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleResolveIssue = async (issueId) => {
    setUpdatingId(issueId);
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };
      await axios.put(
        `/api/issues/${issueId}/status`,
        { status: "Resolved" },
        config
      );
      fetchIssues();
    } catch (error) {
      console.error("Failed to resolve issue", error);
      alert("Could not update the issue status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="animate-spin inline-block" /> Loading Issues...
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Issues</h2>
      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.status === "Open"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {issue.status}
                  </span>
                  <h3 className="text-lg font-semibold mt-2">{issue.title}</h3>
                  <p className="text-gray-600 mt-1">{issue.description}</p>
                </div>
                {issue.status === "Open" && (
                  <button
                    onClick={() => handleResolveIssue(issue._id)}
                    disabled={updatingId === issue._id}
                    className="flex items-center text-sm px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:bg-green-300"
                  >
                    {updatingId === issue._id ? (
                      <Loader2 size={16} className="mr-1 animate-spin" />
                    ) : (
                      <CheckCircle size={16} className="mr-1" />
                    )}
                    Mark as Resolved
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-right">
                Submitted on: {new Date(issue.createdAt).toLocaleString('en-GB')}
                {issue.status === "Resolved" &&
                  ` | Resolved on: ${new Date(
                    issue.resolvedAt
                  ).toLocaleString('en-GB')}`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">
            No issues have been reported. Great job!
          </p>
        )}
      </div>
    </div>
  );
};

export default IssueManager;
