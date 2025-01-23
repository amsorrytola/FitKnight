import { useAppStore } from "../store/store";
import { HOST } from "../utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.error(
      "Socket is not initialized. Ensure SocketProvider is wrapping your component tree."
    );
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null); // Ref for socket instance
  const { userInfo, addNotification,setSocket } = useAppStore(); // State from store

  useEffect(() => {
    if (userInfo) {
      // Initialize socket connection only if `userInfo` exists
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Socket connected:", socket.current.id);
      });

      socket.current.on("disconnect", () => {
        console.warn("Socket disconnected.");
      });

      // Handle received messages
      const handleReceivedMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessages } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessages(message); // Add message to chat
        }
      };

      // Handle notifications
      const handleNotification = (notification) => {
        console.log("Notification received:", notification);
        addNotification(notification); // Update notifications in store
      };

      // Register socket event listeners
      socket.current.on("receiveMessage", handleReceivedMessage);
      socket.current.on("notification", handleNotification);

      setSocket(socket); 
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
