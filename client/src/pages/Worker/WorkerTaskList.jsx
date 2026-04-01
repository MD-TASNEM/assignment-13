import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function WorkerTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskAPI.getAllTasks(page, 10, search);
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
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Available Tasks</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={search}
          onChange={handleSearch}
          className="input-field w-full"
        />
      </div>

      {tasks.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tasks.map((task) => (
              <div key={task._id} className="card hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-4">By: {task.buyer_name}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <p>
                    <span className="font-semibold">Payment:</span>{" "}
                    {task.payable_amount} coins
                  </p>
                  <p>
                    <span className="font-semibold">Available Slots:</span>{" "}
                    {task.required_workers}
                  </p>
                  <p>
                    <span className="font-semibold">Deadline:</span>{" "}
                    {new Date(task.completion_date).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/dashboard/worker-task-details/${task._id}`}
                  className="btn-primary w-full text-center block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
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
        <div className="text-center py-10">
          <p className="text-gray-600">No tasks available at the moment</p>
        </div>
      )}
    </div>
  );
}
