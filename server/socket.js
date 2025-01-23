import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";
import Notification from "./models/NotificationModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const { sender, recipient } = message;
      const senderSocketId = userSocketMap.get(sender);
      const recipientSocketId = userSocketMap.get(recipient);

      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendChannelMessage = async (message) => {
    try {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamp: new Date(),
        fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color");

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const channel = await Channel.findById(channelId).populate("members");

      const channelMessageData = { ...messageData._doc, channelId: channel._id };

      if (channel) {
        // Notify all channel members
        channel.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("receiveChannelMessage", channelMessageData);
          }
        });

        // Notify the channel admin
        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        if (adminSocketId) {
          io.to(adminSocketId).emit("receiveChannelMessage", channelMessageData);
        }
      }
    } catch (error) {
      console.error("Error sending channel message:", error);
    }
  };

  const sendNotification = async (senderId, recipientId, type, message) => {
    try {
      const notification = await Notification.create({
        sender: senderId,
        recipient: recipientId,
        type,
        message,
      });
      console.log("Lo ji Noti",notification)

      const recipientSocketId = userSocketMap.get(recipientId);
      
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", notification);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    socket.on("sendMessage", (message) => {
      sendMessage(message);
    });

    socket.on("send-channel-message", (message)=>{
      console.log("message aaya",message);
      sendChannelMessage(message)});

    // Buddy Finder Notifications
    socket.on("sendNoti", (data) => {
      console.log("Notification data received:", data);
    
      const { senderId, recipientId, type, message } = data;
    
      // Send notification using helper
      sendNotification(senderId, recipientId, type, message);
    });
    

    // Group Organizer Notifications
    // socket.on("newJoinRequest", (data) => {
    //   const { adminId, message } = data;
    //   sendNotification(adminId, "groupNotification", {
    //     type: "JoinRequest",
    //     message,
    //   });
    // });

    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
