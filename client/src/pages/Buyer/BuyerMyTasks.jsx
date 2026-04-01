import { useState, useEffect } from "react";
import { taskAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function BuyerMyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskAPI.getBuyerTasks();
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Tasks</h1>

      <div className="card">
        {tasks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    Task Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Workers</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Amount/Worker
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{task.title}</td>
                    <td className="py-3 px-4">{task.required_workers}</td>
                    <td className="py-3 px-4">{task.payable_amount}</td>
                    <td className="py-3 px-4 font-bold">
                      {task.total_payable}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(task.completion_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet. Create your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
