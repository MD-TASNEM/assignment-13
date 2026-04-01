import { useState, useEffect } from "react";
import { taskAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskAPI.getAllTasks(page, 10);
        setTasks(response.data.tasks || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        setActionLoading(id);
        await taskAPI.deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete task");
        console.error("Delete error:", error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Tasks</h1>

      <div className="card">
        {tasks.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Task Title
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Buyer</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Workers
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">Total</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Deadline
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{task.title}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">
                            {task.buyer_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {task.buyer_email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{task.required_workers}</td>
                      <td className="py-3 px-4">{task.payable_amount}</td>
                      <td className="py-3 px-4 font-bold">
                        {task.total_payable}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(task.completion_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={actionLoading === task._id}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {actionLoading === task._id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
