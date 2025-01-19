export const createNotificationSlice = (set) => ({
  Notifications: [],
  unreadCount: 0,

  // Set initial unread count explicitly
  setUnreadCount: (unreadCount) => set({ unreadCount }),

  // Add a new notification and update unread count if it's unread
  addNotification: (notification) =>
    set((state) => ({
      Notifications: [...state.Notifications, notification],
      unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
    })),

  // Mark a single notification as read and adjust unread count
  markNotificationAsRead: (id) =>
    set((state) => {
      const notification = state.Notifications.find((n) => n._id === id);
      const isUnread = notification && !notification.read;

      return {
        Notifications: state.Notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: isUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    }),

  // Mark multiple notifications as read and adjust unread count
  markNotificationsAsRead: (ids) =>
    set((state) => {
      const updatedNotifications = state.Notifications.map((n) =>
        ids.includes(n._id) ? { ...n, read: true } : n
      );

      const readCount = state.Notifications.filter(
        (n) => ids.includes(n._id) && !n.read
      ).length;

      return {
        Notifications: updatedNotifications,
        unreadCount: state.unreadCount - readCount,
      };
    }),

  // Delete a notification and adjust unread count if it was unread
  deleteNotification: (id) =>
    set((state) => {
      const notificationToDelete = state.Notifications.find((n) => n._id === id);

      return {
        Notifications: state.Notifications.filter((n) => n._id !== id),
        unreadCount:
          notificationToDelete && !notificationToDelete.read
            ? state.unreadCount - 1
            : state.unreadCount,
      };
    }),
});
