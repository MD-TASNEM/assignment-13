import { useState, useEffect } from "react";
import { submissionAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function WorkerSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await submissionAPI.getWorkerSubmissions(currentPage, itemsPerPage);
        setSubmissions(response.data.submissions || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading submissions...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Submissions</h1>

      <div className="card">
        {submissions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Task Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Buyer</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Submitted Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{submission.task_title}</td>
                      <td className="py-3 px-4">{submission.buyer_name}</td>
                      <td className="py-3 px-4 font-semibold">
                        {submission.payable_amount} coins
                      </td>
                      <td className="py-3 px-4">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(submission.status)}`}
                        >
                          {submission.status.charAt(0).toUpperCase() +
                            submission.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">{currentPage}</span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No submissions yet. Complete some tasks to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
