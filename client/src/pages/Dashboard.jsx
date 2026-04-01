import { Link, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  FaHome,
  FaTasks,
  FaFileAlt,
  FaCoins,
  FaHistory,
  FaUsers,
} from "react-icons/fa";

// Worker Pages
import WorkerHome from "./Worker/WorkerHome";
import WorkerTaskList from "./Worker/WorkerTaskList";
import TaskDetails from "./Worker/TaskDetails";
import WorkerSubmissions from "./Worker/WorkerSubmissions";
import WorkerWithdrawals from "./Worker/WorkerWithdrawals";

// Buyer Pages
import BuyerHome from "./Buyer/BuyerHome";
import AddTask from "./Buyer/AddTask";
import BuyerMyTasks from "./Buyer/BuyerMyTasks";
import PurchaseCoin from "./Buyer/PurchaseCoin";
import PaymentHistory from "./Buyer/PaymentHistory";

// Admin Pages
import AdminHome from "./Admin/AdminHome";
import ManageUsers from "./Admin/ManageUsers";
import ManageTasks from "./Admin/ManageTasks";

export default function Dashboard() {
  const { user } = useAuth();

  const renderSidebar = () => {
    const baseLinks = [{ to: "/dashboard", label: "Home", icon: FaHome }];

    if (user?.role === "Worker") {
      return [
        ...baseLinks,
        { to: "/dashboard/worker-tasks", label: "Task List", icon: FaTasks },
        {
          to: "/dashboard/worker-submissions",
          label: "My Submissions",
          icon: FaFileAlt,
        },
        {
          to: "/dashboard/worker-withdrawals",
          label: "Withdrawals",
          icon: FaCoins,
        },
      ];
    }

    if (user?.role === "Buyer") {
      return [
        ...baseLinks,
        {
          to: "/dashboard/buyer-add-task",
          label: "Add New Task",
          icon: FaTasks,
        },
        { to: "/dashboard/buyer-my-tasks", label: "My Tasks", icon: FaFileAlt },
        {
          to: "/dashboard/buyer-purchase-coin",
          label: "Purchase Coin",
          icon: FaCoins,
        },
        {
          to: "/dashboard/buyer-payment-history",
          label: "Payment History",
          icon: FaHistory,
        },
      ];
    }

    if (user?.role === "Admin") {
      return [
        ...baseLinks,
        { to: "/dashboard/admin-users", label: "Manage Users", icon: FaUsers },
        { to: "/dashboard/admin-tasks", label: "Manage Tasks", icon: FaTasks },
      ];
    }

    return baseLinks;
  };

  const sidebarLinks = renderSidebar();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">{user?.role}</p>
        </div>

        <nav className="mt-8">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-l-4 border-transparent hover:border-blue-600"
              >
                <Icon className="text-xl" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            {user?.role === "Worker" && (
              <>
                <Route path="/" element={<WorkerHome />} />
                <Route path="/worker-tasks" element={<WorkerTaskList />} />
                <Route
                  path="/worker-task-details/:id"
                  element={<TaskDetails />}
                />
                <Route
                  path="/worker-submissions"
                  element={<WorkerSubmissions />}
                />
                <Route
                  path="/worker-withdrawals"
                  element={<WorkerWithdrawals />}
                />
              </>
            )}

            {user?.role === "Buyer" && (
              <>
                <Route path="/" element={<BuyerHome />} />
                <Route path="/buyer-add-task" element={<AddTask />} />
                <Route path="/buyer-my-tasks" element={<BuyerMyTasks />} />
                <Route path="/buyer-purchase-coin" element={<PurchaseCoin />} />
                <Route
                  path="/buyer-payment-history"
                  element={<PaymentHistory />}
                />
              </>
            )}

            {user?.role === "Admin" && (
              <>
                <Route path="/" element={<AdminHome />} />
                <Route path="/admin-users" element={<ManageUsers />} />
                <Route path="/admin-tasks" element={<ManageTasks />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}
