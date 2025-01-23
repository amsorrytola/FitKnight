import React, { useEffect, useRef } from "react";
import { useAppStore } from "../../../store/store";
import { apiClient } from "../../../lib/api-client";
import { MARK_AS_READ, DELETE, ADD_BUDDY } from "../../../utils/constants";
import { toast } from "sonner";
import { GET_USER_INFO, ADD_MEMBER } from "../../../utils/constants";

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
    knightInfo,
    setSquireInfo,
    setUserInfo,
    setKnightInfo,
    editChannel,
    setChannelInfo,
  } = useAppStore();

  const socket = useAppStore((state) => state.socket);
  const scrollRef = useRef(null);

  const getUserData = async () => {
    try {
      console.log("Fetching user data...");
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });

      console.log("API Response:", response);

      if (response.status === 200 && response.data.user) {
        const { user, squire, knight, channels } = response.data;

        console.log("User", user);
        // Set base user info
        setUserInfo(user);

        // Handle role-specific state updates
        if (user.role === "Squire" && squire) {
          setSquireInfo(squire);
          setKnightInfo(null); // Ensure role consistency
        } else if (user.role === "Knight" && knight) {
          setChannelInfo(channels);
          setKnightInfo(knight);
          setSquireInfo(null);
        }
      } else {
        setUserInfo(null);
        setSquireInfo(null);
        setKnightInfo(null);
        setChannelInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserInfo(null);
      setSquireInfo(null);
      setKnightInfo(null);
      setChannelInfo(null);
    } finally {
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = Notifications.filter((n) => !n.read).map((n) => n._id);
      if (unreadIds.length > 0) {
        await apiClient.post(
          MARK_AS_READ,
          { notificationIds: unreadIds },
          { withCredentials: true }
        );
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
        params: {
          notificationId,
          Id: knightInfo ? knightInfo.knightId : squireInfo.squireId,
        },
        withCredentials: true,
      });
      deleteNotification(notificationId); // Update store
    } catch (error) {
      console.error("Error deleting notification:", error);
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
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={async () => {
                try {
                  const response = await apiClient.post(
                    ADD_BUDDY,
                    {
                      squireId: squireInfo?.squireId,
                      buddyId: notification?.sender,
                    },
                    { withCredentials: true } // Correct placement
                  );

                  if (response.status === 200 && response.data.buddies) {
                    console.log("Buddy successfully added:", response.data);
                    setSquireInfo((prev) => ({
                      ...prev,
                      buddies: response.data.buddies, // Properly updating state
                    }));
                    toast.success("You two are now buddies");
                  } else {
                    toast.error("Could not add buddy, please try again.");
                  }
                  handleDeleteNotification(notification._id);
                } catch (error) {
                  console.error("Error accepting buddy request:", error);
                  alert("Failed to accept buddy request. Please try again.");
                }
              }}
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={handleDeleteNotification}
            >
              Reject
            </button>
          </div>
        ) : null}
        {notification.type === "JoinRequest" ? (
          <div className="flex">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={async () => {
                const str = notification.message;
                const regex = /group Id:\s([a-f0-9]{24})/; // Match a 24-character hexadecimal group ID

                const match = str.match(regex);
                let groupId;
                if (match) {
                  groupId = match[1];
                  console.log("Extracted groupId:", groupId);
                } else {
                  console.log("No group ID found.");
                  return;
                }

                try {
                  const response = await apiClient.post(
                    ADD_MEMBER,
                    { channelId: groupId, memberId: notification.sender }
                  );
                  console.log("Response:", response);
                  editChannel(response.data.channel);

                  if (response.status === 201) {
                    toast.success("Member added successfully!");
                    getUserData();
                    handleDeleteNotification(notification._id);
                  } else {
                    toast.error("Failed to add member. Please try again.");
                  }
                } catch (error) {
                  console.error("ERROR:", error);
                  toast.error("An error occurred while adding the member.");
                }
              }}
            >
              Accept
            </button>

            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={handleDeleteNotification}
            >
              Reject
            </button>
          </div>
        ) : null}
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
        Unread Notifications:{" "}
        <span className="text-purple-600">{unreadCount}</span>
      </p>
      <div
        className="space-y-4 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        ref={scrollRef}
      >
        {Notifications.length > 0 ? (
          Notifications.map(renderNotification)
        ) : (
          <p className="text-gray-600 text-center">
            No notifications available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
