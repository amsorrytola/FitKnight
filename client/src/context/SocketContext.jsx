import { useAppStore } from "../store/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleRecievedMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessages, addContactsInDMContacts } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id == message.recipient._id)
        ) {
          console.log("message rcv", message);
          addMessages(message);
        }
        addContactsInDMContacts(message)
      };

      const handleRecievedChannelMessage = (message)=>{
        const {selectedChatData, selectedChatType, addMessages, addChannelInChannelList} = useAppStore.getState();
        
        if(
            selectedChatType !== undefined && 
            selectedChatData._id === message.channelId
        ){
            addMessages(message);
        }
        addChannelInChannelList(message);
      }

      socket.current.on("recieveMessage", handleRecievedMessage);
      socket.current.on("recieve-channel-message", handleRecievedChannelMessage);

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
