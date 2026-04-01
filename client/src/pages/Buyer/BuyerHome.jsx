import { useState, useEffect } from "react";
import { FaTasks, FaClock, FaDollarSign } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { taskAPI, submissionAPI, paymentAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function BuyerHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingSubmissions: 0,
    totalSpent: 0,
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch buyer's tasks
        const tasksResponse = await taskAPI.getBuyerTasks();
        const tasks = tasksResponse.data.tasks || [];

        // Fetch pending submissions
        const submissionsResponse = await submissionAPI.getBuyerReview();
        const pendingSubs = submissionsResponse.data.submissions || [];

        // Fetch payment history to calculate total spent
        const paymentsResponse = await paymentAPI.getPaymentHistory();
        const payments = paymentsResponse.data.payments || [];
        const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        setStats({
          totalTasks: tasks.length,
          pendingSubmissions: pendingSubs.filter(s => s.status === 'pending').length,
          totalSpent: totalAmount,
        });

        setSubmissions(pendingSubs.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch buyer stats:", error);
        toast.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}</h1>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Total Tasks</p>
              <p className="text-4xl font-bold">{stats.totalTasks}</p>
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
              <p className="text-green-100 mb-2">Total Spent</p>
              <p className="text-4xl font-bold">${stats.totalSpent}</p>
            </div>
            <FaDollarSign className="text-5xl opacity-20" />
          </div>
        </div>
      </div>

      {/* Task Review Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Submissions to Review</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Worker</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Task Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Payable Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{submission.worker_name}</td>
                    <td className="py-3 px-4">{submission.task_title}</td>
                    <td className="py-3 px-4 font-semibold">
                      {submission.payable_amount} coins
                    </td>
                    <td className="py-3 px-4">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No pending submissions</p>
        )}
      </div>
    </div>
  );
}
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
