import { useState, useEffect } from "react";
import { paymentAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await paymentAPI.getPaymentHistory();
        setPayments(response.data.payments || []);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
        toast.error("Failed to load payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading payment history...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Payment History</h1>

      <div className="card">
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Coins</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{payment.coins}</td>
                    <td className="py-3 px-4">${payment.amount}</td>
                    <td className="py-3 px-4 text-sm">
                      {payment.stripe_id || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(payment.created_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {payment.status || "completed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No payments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
