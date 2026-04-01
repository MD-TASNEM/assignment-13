import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { withdrawalAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function WorkerWithdrawals() {
  const { user } = useAuth();
  const [withdrawForm, setWithdrawForm] = useState({
    withdrawal_coin: "",
    payment_system: "Stripe",
    account_number: "",
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const response = await withdrawalAPI.getWorkerWithdrawals();
        setWithdrawals(response.data.withdrawals || []);
      } catch (error) {
        console.error("Failed to fetch withdrawals:", error);
        toast.error("Failed to load withdrawal history");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateWithdrawalAmount = () => {
    return (parseInt(withdrawForm.withdrawal_coin) / 20).toFixed(2);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const coinToWithdraw = parseInt(withdrawForm.withdrawal_coin);

    if (coinToWithdraw < 200) {
      toast.error("Minimum withdrawal is 200 coins ($10)");
      return;
    }

    if (coinToWithdraw > (user?.coins || 0)) {
      toast.error("Insufficient coins");
      return;
    }

    try {
      setSubmitting(true);
      await withdrawalAPI.requestWithdrawal({
        withdrawal_coin: coinToWithdraw,
        payment_system: withdrawForm.payment_system,
        account_number: withdrawForm.account_number,
      });

      toast.success("Withdrawal request submitted!");
      setWithdrawForm({
        withdrawal_coin: "",
        payment_system: "Stripe",
        account_number: "",
      });

      // Refresh withdrawal history
      const response = await withdrawalAPI.getWorkerWithdrawals();
      setWithdrawals(response.data.withdrawals || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Withdrawal failed. Please try again.",
      );
      console.error("Withdrawal error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const canWithdraw = (user?.coins || 0) >= 200;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Withdrawals</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">Request Withdrawal</h2>

            {/* User Earning Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Current Balance:</span>{" "}
                {user?.coins || 0} coins
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Withdrawal Power:</span> $
                {((user?.coins || 0) / 20).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">20 coins = $1</p>
            </div>

            {!canWithdraw ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700 text-center py-8">
                <p className="text-lg font-semibold">Insufficient Coins</p>
                <p className="text-sm mt-2">
                  Minimum 200 coins ($10) required for withdrawal
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Coin to Withdraw
                  </label>
                  <input
                    type="number"
                    name="withdrawal_coin"
                    value={withdrawForm.withdrawal_coin}
                    onChange={handleInputChange}
                    className="input-field"
                    min="200"
                    max={user?.coins || 0}
                    required
                    placeholder="Enter amount (minimum 200)"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Withdrawal Amount ($)
                  </label>
                  <input
                    type="text"
                    value={
                      withdrawForm.withdrawal_coin
                        ? calculateWithdrawalAmount()
                        : "0"
                    }
                    className="input-field bg-gray-100"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment System
                  </label>
                  <select
                    name="payment_system"
                    value={withdrawForm.payment_system}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Stripe">Stripe</option>
                    <option value="Bkash">Bkash</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="account_number"
                    value={withdrawForm.account_number}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    placeholder="Enter your account/card number"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Request Withdrawal"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div>
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold mb-4">How It Works</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✓ Withdraw your earned coins anytime</li>
              <li>✓ Minimum withdrawal: 200 coins ($10)</li>
              <li>✓ 20 coins = $1</li>
              <li>✓ Multiple payment methods available</li>
              <li>✓ Instant payment processing</li>
              <li>✓ Monitor withdrawal status</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="card mt-8">
        <h2 className="text-2xl font-bold mb-6">Withdrawal History</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Coins</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Amount ($)
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr
                    key={withdrawal._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {withdrawal.withdrawal_coin}
                    </td>
                    <td className="py-3 px-4">
                      ${withdrawal.withdrawal_amount}
                    </td>
                    <td className="py-3 px-4">{withdrawal.payment_system}</td>
                    <td className="py-3 px-4">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          withdrawal.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : withdrawal.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No withdrawal history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
