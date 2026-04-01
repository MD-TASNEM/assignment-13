import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { taskAPI } from "@/services/api";
import { uploadToImageBB, fileToBase64 } from "@/utils/imageUpload";
import toast from "react-hot-toast";
import { FaImage } from "react-icons/fa";

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview
    try {
      const preview = await fileToBase64(file);
      setImagePreview(preview);
    } catch (error) {
      toast.error("Failed to create image preview");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadToImageBB(imageFile);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          task_image_url: result.url,
        }));
        toast.success("Image uploaded successfully!");
        setImageFile(null);
        // Keep preview visible
      } else {
        toast.error(result.error || "Image upload failed");
      }
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    } finally {
      setUploading(false);
    }
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
      setImagePreview(null);

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

          {/* Task Image Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaImage /> Task Image
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Image Upload Status */}
            {formData.task_image_url && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✓ Image uploaded successfully
                </p>
              </div>
            )}

            {/* File Input */}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 p-2 border border-gray-300 rounded-lg input-field"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploading}
                className="btn-secondary disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <p className="text-gray-600 text-sm mt-2">
              Or enter image URL manually:
            </p>
            <input
              type="url"
              name="task_image_url"
              value={formData.task_image_url}
              onChange={handleChange}
              className="input-field mt-2"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-gray-500 text-xs mt-1">
              Max file size: 5MB. Supported: JPG, PNG, GIF, WebP
            </p>
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
