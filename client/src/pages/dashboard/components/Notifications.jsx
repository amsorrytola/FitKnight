import React, { useEffect, useRef } from "react";
import { useAppStore } from "../../../store/store";
import { apiClient } from "../../../lib/api-client";
import { useSocket } from "../../../context/SocketContext";
import {
  MARK_AS_READ,
  DELETE,
  ADD_BUDDY,
} from "../../../utils/constants";
import { toast } from "sonner";

const Notifications = () => {
  const {
    Notifications,
    unreadCount,
    setUnreadCount,
    addNotification,
    markNotificationsAsRead,
    markNotificationAsRead,
    deleteNotification,
    squireInfo,
    setSquireInfo,
  } = useAppStore();

  const socket = useSocket();
  const scrollRef = useRef(null);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = Notifications.filter((n) => !n.read).map((n) => n._id);
      if (unreadIds.length > 0) {
        await apiClient.post(MARK_AS_READ, { notificationIds: unreadIds }, { withCredentials: true });
        markNotificationsAsRead(unreadIds); // Update store
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark a single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await apiClient.post(
        MARK_AS_READ,
        { notificationIds: [id] },
        { withCredentials: true }
      );
      markNotificationAsRead(id); // Update store
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await apiClient.delete(DELETE, {
        params: { notificationId },
        withCredentials: true,
      });
      deleteNotification(notificationId); // Update store
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleAccept = async (notification) => {
    try {
      // Add the sender to the user's buddies list
      const response = await apiClient.post(
        ADD_BUDDY, // Adjust the endpoint as per your API routes
        { squireId: squireInfo.squireId }, // Send the sender's ID in the body
        { withCredentials: true } // Ensure cookies are sent for authentication
      );
  
      // Check if the buddy was successfully added
      if (response.status === 200) {
        console.log("Buddy successfully added:", response.data);
      }
      setSquireInfo({ ...response.data });
      toast.success("You two are now buddies")
    } catch (error) {
      console.error("Error accepting buddy request:", error);
      alert("Failed to accept buddy request. Please try again.");
    }
  };
  

  // Render a single notification
  const renderNotification = (notification) => (
    <div
      key={notification._id}
      className={`p-3 rounded-lg shadow mb-2 flex justify-between items-start transition ${
        notification.read ? "bg-gray-100" : "bg-purple-100"
      }`}
    >
      <div className="flex-1 pr-4">
        <p className="font-semibold text-gray-800">{notification.type}</p>
        <p className="text-gray-600 text-sm">{notification.message}</p>
        {notification.type === "BuddyRequest" ? (
          <div className="flex"> 
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
                onClick={handleAccept(notification)}>
                  Accept
                </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
                onClick={handleSendRequest}>
                  Reject
                </button>
          </div>
        ):(<div> </div>)}
      </div>
      <div className="flex flex-col items-end gap-2">
        {!notification.read && (
          <button
            onClick={() => handleMarkAsRead(notification._id)}
            className="text-blue-500 text-sm hover:underline"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => handleDeleteNotification(notification._id)}
          className="text-red-500 text-sm hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600 transition"
        >
          Mark All as Read
        </button>
      </div>
      <p className="font-semibold text-gray-700 mb-4">
        Unread Notifications: <span className="text-purple-600">{unreadCount}</span>
      </p>
      <div
        className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        ref={scrollRef}
      >
        {Notifications.length > 0 ? (
          Notifications.map(renderNotification)
        ) : (
          <p className="text-gray-600 text-center">No notifications available.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
