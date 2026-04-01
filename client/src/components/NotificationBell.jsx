import { useState, useEffect } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { notificationAPI } from "@/services/api";
import toast from "react-hot-toast";

export default function NotificationBell() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount and when bell is clicked
  useEffect(() => {
    if (user && showNotifications) {
      fetchNotifications();
    }
  }, [user, showNotifications]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getNotifications();
      const allNotifications = response.data || [];
      setNotifications(allNotifications);

      // Count unread
      const unread = allNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Still show skeleton to user
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-gray-700 hover:text-blue-600 transition"
        title="Notifications"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-blue-50 border-b p-4 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <p className="mb-2">No notifications yet</p>
              <p className="text-sm text-gray-500">
                You&apos;ll receive updates on your tasks and withdrawals here
              </p>
            </div>
          ) : (
            <div>
              {/* Notifications List */}
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p
                          className={`${
                            !notification.read ? "font-semibold" : ""
                          } text-gray-800 text-sm`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            notification.created_date,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification._id)
                        }
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              {unreadCount > 0 && (
                <div className="border-t bg-gray-50 p-3 text-center">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
