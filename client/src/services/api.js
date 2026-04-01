import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  getCurrentUser: () => apiClient.get("/auth/me"),
};

// User APIs
export const userAPI = {
  getUser: (id) => apiClient.get(`/users/${id}`),
  getAllUsers: () => apiClient.get("/users"),
  updateProfile: (id, data) => apiClient.put(`/users/${id}`, data),
  updateRole: (id, role) => apiClient.put(`/users/${id}/role`, { role }),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getTopWorkers: () => apiClient.get("/users/leaderboard/top-workers"),
};

// Task APIs
export const taskAPI = {
  getAllTasks: (page = 1, limit = 10, search = "") =>
    apiClient.get("/tasks", { params: { page, limit, search } }),
  getTask: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (data) => apiClient.post("/tasks", data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getBuyerTasks: () => apiClient.get("/tasks/buyer/my-tasks"),
};

// Submission APIs
export const submissionAPI = {
  createSubmission: (data) => apiClient.post("/submissions", data),
  getWorkerSubmissions: (page = 1, limit = 10) =>
    apiClient.get("/submissions/worker/my-submissions", {
      params: { page, limit },
    }),
  getBuyerReview: () => apiClient.get("/submissions/buyer/to-review"),
  getSubmission: (id) => apiClient.get(`/submissions/${id}`),
  approveSubmission: (id) => apiClient.put(`/submissions/${id}/approve`),
  rejectSubmission: (id) => apiClient.put(`/submissions/${id}/reject`),
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: (coins, amount) =>
    apiClient.post("/payments/create-intent", { coins, amount }),
  confirmPayment: (paymentIntentId, coins, amount) =>
    apiClient.post("/payments/confirm", { paymentIntentId, coins, amount }),
  getPaymentHistory: () => apiClient.get("/payments/history"),
};

// Withdrawal APIs
export const withdrawalAPI = {
  requestWithdrawal: (data) => apiClient.post("/withdrawals", data),
  getWorkerWithdrawals: () =>
    apiClient.get("/withdrawals/worker/my-withdrawals"),
  getPendingWithdrawals: () => apiClient.get("/withdrawals/admin/pending"),
  approveWithdrawal: (id) => apiClient.put(`/withdrawals/${id}/approve`),
  rejectWithdrawal: (id) => apiClient.put(`/withdrawals/${id}/reject`),
  getWithdrawal: (id) => apiClient.get(`/withdrawals/${id}`),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => apiClient.get("/notifications"),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put("/notifications/read/all"),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};

export default apiClient;
