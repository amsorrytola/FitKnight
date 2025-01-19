import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "../../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store/store";
import { useSocket } from "../../../context/SocketContext";

const BuddyCard = ({ buddy, loading }) => {
  const [open, setOpen] = useState(false);
  const [isBuddyFriend, setIsBuddyFriend] = useState(false);
  const navigate = useNavigate();
  const {
    setSelectedChatData,
    setSelectedChatType,
    userInfo,
    squireInfo,
  } = useAppStore();
  const socket = useSocket();

  // // Debugging logs
  // console.log("SquireInfo", squireInfo);
  // console.log("UserInfo", userInfo);
  // console.log("Buddy", buddy);

  // Determine if the buddy is already a friend
  useEffect(()=>{
    setIsBuddyFriend(squireInfo.buddies.find((id) => id === buddy.user._id));
},[])

  // Send a friend request
  const handleSendRequest = () => {
    console.log("Socket instance in handleSendRequest:", socket);
  
    if (socket) {
      socket.emit("sendNoti", {
        senderId: userInfo.id,
        type: "BuddyRequest",
        recipientId: buddy.user._id,
        message: `${userInfo.firstName} wants to become your buddy!`,
      });
      console.log("Friend request sent to:", buddy.user._id);
    } else {
      console.error("Socket is undefined. Ensure SocketProvider is initialized.");
    }
  };
  

  // Navigate to chat
  const handleMessage = async () => {
    await setSelectedChatType("contact");
    await setSelectedChatData(buddy.user);
    navigate("/chat");
  };

  // Loading Skeleton
  if (loading) {
    return (
      <Card className="w-[500px] h-[300px] md:h-[350px] lg:h-[400px] flex flex-col items-center justify-center rounded-lg shadow-lg bg-gray-50 space-y-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-1/2" />
      </Card>
    );
  }

  return (
    <div className="w-[500px] max-w-md">
      <Card className="flex w-[300px] flex-col items-center p-4 bg-white shadow-lg rounded-lg hover:shadow-2xl transition-all">
        {/* Profile Picture */}
        {buddy?.user?.image ? (
          <img
            src={buddy.user.image}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-2 border-purple-500 shadow-md flex justify-center items-center"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gray-400 flex items-center justify-center text-xl font-bold text-white">
            {buddy?.user?.firstName?.charAt(0) || "?"}
          </div>
        )}

        {/* Buddy Info */}
        <div className="text-center mt-4 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {`${buddy?.user?.firstName || "Unknown"} ${
              buddy?.user?.lastName || ""
            }`}
          </h2>
          <p className="text-sm text-gray-600">
            Age: {buddy?.user?.age || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            Buddy Type:{" "}
            {buddy?.buddyType?.map((type) => type.label).join(", ") || "N/A"}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {buddy?.user?.shortDescription || "No description available."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600 transition"
            onClick={() => setOpen(true)}
          >
            View Profile
          </button>
          {isBuddyFriend ? (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={handleMessage}
            >
              Message
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition"
              onClick={handleSendRequest}
            >
              Send Friend Request
            </button>
          )}
        </div>
      </Card>

      {/* Dialog for Buddy Details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-lg shadow-xl">
          <DialogHeader>
            <h3 className="text-2xl font-bold text-gray-800">
              {`${buddy?.user?.firstName || "Unknown"} ${
                buddy?.user?.lastName || ""
              }`}
            </h3>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              {buddy?.user?.shortDescription || "No description available."}
            </p>
            <p className="text-sm text-gray-600">
              Age: {buddy?.user?.age || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Buddy Type:{" "}
              {buddy?.buddyType?.map((type) => type.label).join(", ") || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              Location: {buddy?.user?.address || "Unknown"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuddyCard;
