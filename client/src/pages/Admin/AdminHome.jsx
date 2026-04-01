import { useState, useEffect } from "react";
import { FaUsers, FaTasks, FaCoins, FaDollarSign } from "react-icons/fa";
import { userAPI, paymentAPI, withdrawalAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalBuyers: 0,
    totalCoins: 0,
    totalPayments: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all users
        const usersResponse = await userAPI.getAllUsers();
        const allUsers = usersResponse.data.users || [];
        const totalWorkers = allUsers.filter((u) => u.role === "Worker").length;
        const totalBuyers = allUsers.filter((u) => u.role === "Buyer").length;
        const totalCoins = allUsers.reduce((sum, u) => sum + (u.coins || 0), 0);

        // Fetch all payments to calculate total spent
        const paymentsResponse = await paymentAPI.getPaymentHistory();
        const allPayments = paymentsResponse.data.payments || [];
        const totalPayments = allPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0,
        );

        setStats({
          totalWorkers,
          totalBuyers,
          totalCoins,
          totalPayments,
        });

        // Fetch pending withdrawals
        const withdrawalsResponse = await withdrawalAPI.getPendingWithdrawals();
        setWithdrawals(withdrawalsResponse.data.withdrawals || []);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleApprove = async (withdrawalId) => {
    try {
      setActionLoading(withdrawalId);
      await withdrawalAPI.approveWithdrawal(withdrawalId);
      setWithdrawals(withdrawals.filter((w) => w._id !== withdrawalId));
      toast.success("Withdrawal approved!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve withdrawal",
      );
      console.error("Approval error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (withdrawalId) => {
    try {
      setActionLoading(withdrawalId);
      await withdrawalAPI.rejectWithdrawal(withdrawalId);
      setWithdrawals(withdrawals.filter((w) => w._id !== withdrawalId));
      toast.success("Withdrawal rejected!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject withdrawal",
      );
      console.error("Rejection error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1 text-sm">Total Workers</p>
              <p className="text-4xl font-bold">{stats.totalWorkers}</p>
            </div>
            <FaUsers className="text-4xl opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1 text-sm">Total Buyers</p>
              <p className="text-4xl font-bold">{stats.totalBuyers}</p>
            </div>
            <FaTasks className="text-4xl opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-1 text-sm">Total Coins</p>
              <p className="text-4xl font-bold">{stats.totalCoins}</p>
            </div>
            <FaCoins className="text-4xl opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1 text-sm">Total Payments</p>
              <p className="text-4xl font-bold">${stats.totalPayments}</p>
            </div>
            <FaDollarSign className="text-4xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Pending Withdrawal Requests</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Worker</th>
                  <th className="text-left py-3 px-4 font-semibold">Coins</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Amount ($)
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold">
                          {withdrawal.worker_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {withdrawal.worker_email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{withdrawal.withdrawal_coin}</td>
                    <td className="py-3 px-4 font-semibold">
                      ${withdrawal.withdrawal_amount}
                    </td>
                    <td className="py-3 px-4">{withdrawal.payment_system}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleApprove(withdrawal._id)}
                        disabled={actionLoading === withdrawal._id}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {actionLoading === withdrawal._id ? "..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal._id)}
                        disabled={actionLoading === withdrawal._id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {actionLoading === withdrawal._id ? "..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No pending withdrawals</p>
        )}
      </div>
    </div>
  );
}
