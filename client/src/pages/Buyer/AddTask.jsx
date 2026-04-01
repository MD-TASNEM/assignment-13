import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { taskAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function AddTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    required_workers: "",
    payable_amount: "",
    completion_date: "",
    submission_info: "",
    task_image_url: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.detail ||
        !formData.required_workers ||
        !formData.payable_amount ||
        !formData.completion_date ||
        !formData.submission_info
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const requiredWorkers = parseInt(formData.required_workers);
      const payableAmount = parseInt(formData.payable_amount);
      const totalPayable = requiredWorkers * payableAmount;

      if (totalPayable > (user?.coins || 0)) {
        toast.error(
          `Not enough coins. You need ${totalPayable} coins but have ${user?.coins}`,
        );
        setLoading(false);
        // Could navigate to purchase coin page here if desired
        return;
      }

      // Create the task via API
      const taskData = {
        title: formData.title,
        detail: formData.detail,
        required_workers: requiredWorkers,
        payable_amount: payableAmount,
        completion_date: formData.completion_date,
        submission_info: formData.submission_info,
        task_image_url:
          formData.task_image_url || "https://via.placeholder.com/300",
      };

      await taskAPI.createTask(taskData);

      toast.success("Task created successfully!");
      setFormData({
        title: "",
        detail: "",
        required_workers: "",
        payable_amount: "",
        completion_date: "",
        submission_info: "",
        task_image_url: "",
      });

      // Navigate to my tasks
      navigate("/dashboard/buyer-my-tasks");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create task. Please try again.",
      );
      console.error("Task creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayable =
    formData.required_workers && formData.payable_amount
      ? parseInt(formData.required_workers) * parseInt(formData.payable_amount)
      : 0;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Add New Task</h1>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Watch my YouTube video and make a comment"
              required
            />
          </div>

          {/* Task Detail */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Task Detail
            </label>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Detailed description of the task"
              required
            ></textarea>
          </div>

          {/* Required Workers & Payable Amount */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Required Workers
              </label>
              <input
                type="number"
                name="required_workers"
                value={formData.required_workers}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 100"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Payable Amount ($)
              </label>
              <input
                type="number"
                name="payable_amount"
                value={formData.payable_amount}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 10"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Total Payable */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <span className="font-semibold">Total Payable:</span>{" "}
              {totalPayable} coins (${(totalPayable / 10).toFixed(2)})
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Your Balance:</span>{" "}
              {user?.coins || 0} coins
            </p>
          </div>

          {/* Completion Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Completion Deadline
            </label>
            <input
              type="date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Submission Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Submission Information
            </label>
            <textarea
              name="submission_info"
              value={formData.submission_info}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="What should workers submit? (e.g., Screenshot of the comment)"
              required
            ></textarea>
          </div>

          {/* Task Image URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Task Image URL
            </label>
            <input
              type="url"
              name="task_image_url"
              value={formData.task_image_url}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Creating Task..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
