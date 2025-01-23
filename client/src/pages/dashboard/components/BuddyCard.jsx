import React, { useEffect, useState } from "react";
import { Card} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store/store";
import { useSocket } from "../../../context/SocketContext";
import { HOST } from "../../../utils/constants";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const BuddyCard = ({ buddy, loading }) => {
  const [open, setOpen] = useState(false);
  const [isBuddyFriend, setIsBuddyFriend] = useState(false);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { setSelectedChatData, setSelectedChatType, userInfo, squireInfo } =
    useAppStore();
  const socket = useAppStore(state => state.socket);

  // // Debugging logs
  // console.log("SquireInfo", squireInfo);
  // console.log("UserInfo", userInfo);
  // console.log("Buddy", buddy);

  useEffect(() => {
    setImage(buddy?.user.image ? `${HOST}/${buddy.user.image}` : "");
    setIsBuddyFriend(squireInfo.buddies.find((id) => id === buddy.user._id));
  }, []);

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
      console.error(
        "Socket is undefined. Ensure SocketProvider is initialized."
      );
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
      <Card className="relative w-[350px] max-w-xs md:max-w-sm lg:max-w-md h-[280px] md:h-[320px] lg:h-[380px] flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl space-y-6 animate-pulse">
        {/* Profile Picture Skeleton */}
        <div className="relative">
          <Skeleton className="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full border-4 border-purple-500 shadow-md" />
          <div className="absolute top-2 right-2 h-6 w-6 bg-gray-700 rounded-full"></div>
        </div>

        {/* Name Skeleton */}
        <Skeleton className="h-5 w-3/4 md:w-2/3 bg-gray-700 rounded-md" />

        {/* Info Skeletons */}
        <div className="w-full flex flex-col items-center space-y-3">
          <Skeleton className="h-4 w-5/6 md:w-3/4 bg-gray-700 rounded-md" />
          <Skeleton className="h-4 w-4/6 md:w-1/2 bg-gray-700 rounded-md" />
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-10 w-28 md:w-32 bg-purple-700 rounded-full" />
          <Skeleton className="h-10 w-28 md:w-32 bg-gray-600 rounded-full" />
        </div>

        {/* Glowing Animation Effect */}
        <div className="absolute inset-0 bg-gray-800 rounded-2xl opacity-20 animate-pulse"></div>
      </Card>
    );
  }

  return (
    <div className="w-[350px] h-[500px] flex justify-center items-center max-w-md">
      <Card className="relative w-full max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 scale-100 hover:scale-105 duration-300">
        {/* Profile Picture */}
        {buddy?.user?.image ? (
          <img
            src={image}
            alt={`${buddy?.user?.firstName || "Unknown"}'s profile`}
            className="h-28 w-28 rounded-full object-cover border-4 border-purple-500 shadow-md hover:border-purple-400 transition-all"
          />
        ) : (
          <div className="h-28 w-28 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-500 shadow-md">
            {buddy?.user?.firstName?.charAt(0) || "?"}
          </div>
        )}

        {/* Buddy Info */}
        <div className="text-center mt-5 space-y-3 text-gray-300">
          <h2 className="text-xl font-bold text-purple-400">
            {`${buddy?.user?.firstName || "Unknown"} ${
              buddy?.user?.lastName || ""
            }`}
          </h2>
          <p className="text-sm text-gray-400">
            Age:{" "}
            <span className="text-white font-medium">
              {buddy?.user?.age || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Buddy Type:{" "}
            <span className="text-white font-medium">
              {buddy?.buddyType?.map((type) => type.label).join(", ") || "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-400 line-clamp-2 italic">
            {buddy?.user?.shortDescription || "No description available."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-3 w-full">
          <button
            className="px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
            onClick={() => {
              console.log("Card Buddy", buddy);
              setOpen(true);
            }}
          >
            View Profile
          </button>
          {!isBuddyFriend ? (
            <button
              className="px-5 py-2 bg-gray-300 text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-400 transition-all shadow-md hover:shadow-lg"
              onClick={handleMessage}
            >
              Message
            </button>
          ) : (
            <button
              className="px-5 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
              onClick={handleSendRequest}
            >
              Send Friend Request
            </button>
          )}
        </div>

        {/* Distance Badge */}
        {buddy.distance ? (
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
            {buddy.distance.toFixed(1)} km away
          </div>
        ) : null}
      </Card>

      {/* Dialog for Buddy Details */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl mx-auto rounded-lg shadow-2xl p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Profile Details</DialogTitle>
            </VisuallyHidden>
            <div className="flex items-center space-x-6">
              <img
                src={image}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-purple-500 shadow-lg object-cover"
              />
              <div>
                <h3 className="text-3xl font-bold">
                  {`${buddy?.user?.firstName || "Unknown"} ${
                    buddy?.user?.lastName || ""
                  }`}
                </h3>
              </div>
            </div>
          </DialogHeader>

          {/* Profile Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Personal Info
              </h4>
              <p className="text-lg">
                <strong>Age:</strong> {buddy?.user?.age || "N/A"}
              </p>
              <p className="text-lg">
                <strong>Gender:</strong> {buddy?.user?.gender || "N/A"}
              </p>
              <p className="text-lg">
                <strong>Location:</strong> {buddy?.address || "Unknown"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Fitness Goals
              </h4>
              <p className="text-lg">
                {buddy?.FitnessGoals?.map((goal) => goal.label).join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Preferences
              </h4>
              <p className="text-lg">
                {buddy?.Preferences?.map((pref) => pref.label).join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Availability
              </h4>
              <p className="text-lg">
                {buddy?.availability?.map((avail) => avail.label).join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Buddy Type
              </h4>
              <p className="text-lg">
                {buddy?.buddyType?.map((type) => type.label).join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Available Days
              </h4>
              <p className="text-lg">
                {buddy?.availableDays?.map((day) => day.label).join(", ") ||
                  "N/A"}
              </p>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h4 className="text-2xl font-semibold text-purple-400 mb-4">
              Achievements
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-4 p-2 border border-gray-600 rounded-lg shadow-inner">
              {buddy?.achievements?.length > 0 ? (
                <ul className="space-y-4">
                  {buddy.achievements.map((achieve, index) => (
                    <li
                      key={index}
                      className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <h5 className="text-xl font-bold text-purple-300">
                        {achieve.title}
                      </h5>
                      <p className="text-lg text-gray-300">
                        {achieve.description}
                      </p>
                      <p className="text-sm text-gray-400">
                        Date: {new Date(achieve.date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-lg">
                  No achievements available.
                </p>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8 border-t border-gray-700 pt-6">
            <h4 className="text-2xl font-semibold text-purple-400">
              Contact Details
            </h4>
            <p className="text-lg">
              <strong>Email:</strong>{" "}
              {buddy?.user?.privacySettings?.emailVisible
                ? "Hidden"
                : buddy?.user?.email}
            </p>
            <p className="text-lg">
              <strong>Phone:</strong>{" "}
              {buddy?.user?.privacySettings?.phoneVisible
                ? "Hidden"
                : buddy?.user?.phoneNumber || "N/A"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuddyCard;
