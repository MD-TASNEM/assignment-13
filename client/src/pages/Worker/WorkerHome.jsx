import { useState, useEffect } from "react";
import { FaTasks, FaClock, FaCoins } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { submissionAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function WorkerHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    currentCoins: 0,
  });
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all submissions to calculate stats
        const response = await submissionAPI.getWorkerSubmissions(1, 100);
        const submissions = response.data.submissions || [];

        const totalSubmissions = submissions.length;
        const pendingSubmissions = submissions.filter(
          (s) => s.status === "pending",
        ).length;
        const approvedSubs = submissions.filter((s) => s.status === "approved");

        setStats({
          totalSubmissions,
          pendingSubmissions,
          currentCoins: user?.coins || 0,
        });

        // Display only first 3 approved submissions
        setApprovedSubmissions(approvedSubs.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.coins]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}</h1>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Total Submissions</p>
              <p className="text-4xl font-bold">{stats.totalSubmissions}</p>
            </div>
            <FaTasks className="text-5xl opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-2">Pending Submissions</p>
              <p className="text-4xl font-bold">{stats.pendingSubmissions}</p>
            </div>
            <FaClock className="text-5xl opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Current Coins</p>
              <p className="text-4xl font-bold">{stats.currentCoins}</p>
            </div>
            <FaCoins className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Recent Approved Submissions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Approved Submissions</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : approvedSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    Task Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Buyer</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedSubmissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{submission.task_title}</td>
                    <td className="py-3 px-4 font-semibold">
                      {submission.payable_amount} coins
                    </td>
                    <td className="py-3 px-4">{submission.buyer_name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No approved submissions yet</p>
        )}
      </div>
    </div>
  );
}
