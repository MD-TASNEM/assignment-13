import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function TaskDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Fetch task details from API
    setTask({
      id: 1,
      title: "Watch YouTube Video and Comment",
      detail:
        "Watch our YouTube video for 5 minutes and leave a meaningful comment.",
      buyer_name: "John Doe",
      buyer_email: "john@example.com",
      payable_amount: 10,
      required_workers: 50,
      completion_date: "2024-12-31",
      submission_info: "Submit screenshot of your comment",
      task_image_url: "https://via.placeholder.com/400x300",
    });
    setLoading(false);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!submissionDetails.trim()) {
        toast.error("Please provide submission details");
        return;
      }

      // TODO: Submit to API
      toast.success("Submission successful! Waiting for review.");
      setSubmissionDetails("");
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading task details...</div>;
  }

  if (!task) {
    return <div className="text-center py-10">Task not found</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">{task.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Task Details */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <img
              src={task.task_image_url}
              alt={task.title}
              className="w-full rounded-lg mb-6"
            />

            <h2 className="text-2xl font-bold mb-4">Task Description</h2>
            <p className="text-gray-700 mb-6">{task.detail}</p>

            <h3 className="text-xl font-bold mb-2">Submission Requirements</h3>
            <p className="text-gray-700 mb-6">{task.submission_info}</p>
          </div>

          {/* Submission Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Submit Your Work</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Submission Details
                </label>
                <textarea
                  value={submissionDetails}
                  onChange={(e) => setSubmissionDetails(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  rows="6"
                  placeholder="Describe how you completed this task, provide proof/details..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 w-full"
              >
                {submitting ? "Submitting..." : "Submit Task"}
              </button>
            </form>
          </div>
        </div>

        {/* Task Info Sidebar */}
        <div>
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold mb-6">Task Information</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Payment Amount</p>
                <p className="text-3xl font-bold text-green-600">
                  ${task.payable_amount}
                </p>
              </div>

              <hr />

              <div>
                <p className="text-gray-600">Available Slots</p>
                <p className="text-2xl font-bold">{task.required_workers}</p>
              </div>

              <hr />

              <div>
                <p className="text-gray-600">Deadline</p>
                <p className="text-lg font-semibold">{task.completion_date}</p>
              </div>

              <hr />

              <div>
                <p className="text-gray-600">Posted by</p>
                <p className="font-semibold">{task.buyer_name}</p>
                <p className="text-sm text-gray-600">{task.buyer_email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
