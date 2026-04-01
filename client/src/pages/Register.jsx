import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { uploadToImageBB, fileToBase64 } from "@/utils/imageUpload";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoUrl: "",
    role: "Worker",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

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
          photoUrl: result.url,
        }));
        toast.success("Profile photo uploaded!");
        setImageFile(null);
      } else {
        toast.error(result.error || "Upload failed");
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

    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        photo_url: formData.photoUrl || "https://via.placeholder.com/150",
      };

      const result = await registerUser(registrationData);

      if (result.success) {
        const initialCoins = formData.role === "Worker" ? 10 : 50;
        toast.success(`Account created! You received ${initialCoins} coins.`);
        navigate("/dashboard");
      } else {
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-600 text-center mb-8">
          Join our growing community
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="Your Full Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaUser /> Profile Picture
            </label>

            {/* Photo Preview */}
            {imagePreview && (
              <div className="mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Upload Success */}
            {formData.photoUrl && (
              <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                ✓ Photo uploaded
              </div>
            )}

            {/* File Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 text-sm"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploading}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {uploading ? "..." : "Upload"}
              </button>
            </div>

            {/* Manual URL */}
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="input-field text-sm"
              placeholder="Or paste image URL"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              I want to join as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Worker">Worker</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
