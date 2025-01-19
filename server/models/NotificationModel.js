import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },

  type: {
    type: String,
    enum: ["BuddyMessage", "JoinRequest", "GroupMessage","BuddyRequest"],
    required: true,
  },
  message: { type: String, required: true }, // Notification content
  read: { type: Boolean, default: false }, // Read/unread status
  timestamp: { type: Date, default: Date.now }, // Time of notification
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
