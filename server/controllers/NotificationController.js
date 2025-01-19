import Notification from "../models/NotificationModel.js";

export const createNotification = async (senderId, recipientId, type, message) => {
  try {
    const notification = await Notification.create({
      sender: senderId,
      recipient: recipientId,
      type,
      message,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req; // Fetched via authentication middleware
    const notifications = await Notification.find({ recipient: userId })
      .sort({ timestamp: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req;
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ message: "Invalid notification IDs." });
    }

    await Notification.updateMany(
      { recipient: userId, _id: { $in: notificationIds } },
      { read: true }
    );

    res.status(200).json({ message: "Notifications marked as read." });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { userId } = req; // From authentication middleware
    const { notificationId } = req.query;

    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required." });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


