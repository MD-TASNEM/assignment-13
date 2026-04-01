import { useState, useEffect } from "react";
import { userAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getAllUsers();
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        setActionLoading(id);
        await userAPI.deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
        toast.success("User removed successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove user");
        console.error("Delete error:", error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      setActionLoading(id);
      await userAPI.updateRole(id, role);
      setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
      setEditingId(null);
      toast.success("User role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
      console.error("Update error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Manage Users</h1>

      <div className="card">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Coins</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photo_url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <p className="font-semibold">{user.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      {editingId === user._id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="input-field text-sm"
                          onBlur={() => handleUpdateRole(user._id, newRole)}
                        >
                          <option value="Worker">Worker</option>
                          <option value="Buyer">Buyer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold">{user.coins}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(user._id);
                          setNewRole(user.role);
                        }}
                        disabled={actionLoading === user._id}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        {actionLoading === user._id ? "..." : "Edit Role"}
                      </button>
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        disabled={actionLoading === user._id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {actionLoading === user._id ? "..." : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
