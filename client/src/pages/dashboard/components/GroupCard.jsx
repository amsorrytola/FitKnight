import React, { useState, useEffect,useRef } from "react";
import { Card } from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Skeleton } from "../../../components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../../store/store";
import { useSocket } from "../../../context/SocketContext";
import { HOST } from "../../../utils/constants";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { apiClient } from "../../../lib/api-client";
import { GET_MEMBER_INFO } from "../../../utils/constants";

const GroupCard = ({ group, loading }) => {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isGroupJoined, setIsGroupJoined] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [image, setImage] = useState("");
  const [membersInfo, setMembersInfo] = useState([]);
  const [adminInfo,setAdminInfo] = useState(null);
  const navigate = useNavigate();
  
  const { setSelectedChatData, setSelectedChatType, userInfo, squireInfo } =
    useAppStore();

  const socket = useAppStore(state => state.socket);
  useEffect(() => {
    console.log(group);
    setImage(group?.image ? `${HOST}/${group.image}` : "");
    setIsGroupJoined(squireInfo.groups.find((id) => id === group._id));
    
  }, []);

  const handleMessage = async () => {};
  const handleSendRequest = async () => {
    console.log("Socket instance in handleSendRequest:", socket.current);

    if (socket.current) {
      socket.current.emit("sendNoti", {
        senderId: userInfo.id,
        type: "JoinRequest",
        recipientId: group.admin,
        message:`${userInfo.firstName} wants to join your group ${group.name} of group Id: ${group._id}!`,
      });
      console.log("Join request sent to:", group.admin);
    } else {
      console.error("Socket is undefined. Ensure socket is initialized.");
    }
  };
  

  const getadmin = async() => {
    try {
      const memberId = group.admin;
      const response = await apiClient.get(GET_MEMBER_INFO,{
        params: {memberId: memberId},
      })
      console.log("Admin",response)
      setAdminInfo(response.data);
    } catch (error) {
      
    }
  }
  const getMembers = async () => {
    try {
      const memberIds = group.members;

      // Use Promise.all to fetch all members concurrently
      const responses = await Promise.all(
        memberIds.map(async (memberId) => {
          const response = await apiClient.get(GET_MEMBER_INFO, {
            params: { memberId: memberId },
          });
          return response.data;
        })
      );

      console.log("Members info:", responses);
      setMembersInfo(responses); // Store all members at once
    } catch (error) {
      console.error(
        "ERROR fetching members:",
        error.response?.data || error.message
      );
    }
  };

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
    <div className="w-[300px] h-[450px] flex justify-center items-center max-w-md">
      <Card className="relative w-full max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 scale-100 hover:scale-105 duration-300">
        {/* Profile Picture */}
        {group?.image ? (
          <img
            src={image}
            alt={`${group?.name || "Unknown"}'s profile`}
            className="h-28 w-28 rounded-full object-cover border-4 border-purple-500 shadow-md hover:border-purple-400 transition-all"
          />
        ) : (
          <div className="h-28 w-28 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-500 shadow-md">
            {group?.name?.charAt(0) || "?"}
          </div>
        )}

        {/* Group Info */}
        <div className="text-center mt-5 space-y-3 text-gray-300">
          <h2 className="text-xl font-bold text-purple-400">
            {`${group?.name || "Unknown"} `}
          </h2>

          <p className="text-sm text-gray-400">
            Activity Type:{" "}
            <span className="text-white font-medium">
              {group?.activityType?.map((type) => type.label).join(", ") ||
                "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-400 line-clamp-2 italic">
            {group?.description || "No description available."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 gap-3 w-full">
          <div>
            <button
              className="px-2 py-2 bg-purple-600 text-white rounded-full text-[12px] font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              onClick={() => {
                getMembers();
                console.log("Card Group", group);
                setOpen(true);
              }}
            >
              View Group Details
            </button>
            <button
              className="px-2 py-2 bg-purple-600 text-white rounded-full text-[12px] mt-2 font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              onClick={() => {
                console.log("Group Admin", group.admin);
                setAdminOpen(true);
              }}
            >
              View Admin Profile
            </button>
          </div>
          {isGroupJoined ? (
            <button
              className="px-5 py-2 bg-gray-300 text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-400 transition-all shadow-md hover:shadow-lg"
              onClick={handleMessage}
            >
              Message
            </button>
          ) : (
            <button
              className="px-3 py-2 bg-gray-700 text-white rounded-full text-[15px] font-semibold hover:bg-gray-600 transition-all shadow-md hover:shadow-lg"
              onClick={handleSendRequest}
            >
              Send Join Request
            </button>
          )}
        </div>

        {/* Distance Badge */}
        {group.distance ? (
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 text-xs rounded-full shadow-md">
            {group.distance.toFixed(1)} km away
          </div>
        ) : null}
      </Card>

      {/* Dialog for Group Details */}

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
                  {`${group?.name || "Unknown"}`}
                </h3>
              </div>
            </div>
          </DialogHeader>

          {/* Profile Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Group Info
              </h4>

              <p className="text-lg">
                <strong>Location:</strong> {group?.address || "Unknown"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Activity Type
              </h4>
              <p className="text-lg">
                {group?.activityType?.map((goal) => goal.label).join(", ") ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-semibold text-purple-400">
                Schedule
              </h4>
              <p className="text-lg">
                {group?.schedule?.map((pref) => pref.label).join(", ") || "N/A"}
              </p>
            </div>
          </div>

          {/*Members Section */}
          <div className="w-[300px] bg-[#2c2e3b] text-white border border-gray-700 rounded-lg shadow-lg p-6 mt-4 md:mt-0">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-600 pb-2">
              Members
            </h2>
            <div className="h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-3">
              {membersInfo.length > 0 ? (
                membersInfo.map((member, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-lg hover:shadow-2xl transition-all transform scale-100 hover:scale-105 duration-300 p-3 flex items-center gap-4"
                  >
                    {member.user?.image ? (
                      <img
                        src={`${HOST}/${member.user.image}`}
                        alt={member.user.firstName}
                        className="h-12 w-12 rounded-full object-cover border-4 border-purple-500 shadow-md hover:border-purple-400 transition-all"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-500 shadow-md">
                        {member.user.firstName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-md font-semibold">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                    </div>
                    <button
                      className="px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                      onClick={() => setMemberOpen(true)}
                    >
                      View Profile
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center flex-col space-y-3">
                  <div className="animate-pulse flex flex-col items-center space-y-3">
                    <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-20 bg-gray-700 rounded"></div>
                    <div className="h-2 w-12 bg-gray-700 rounded"></div>
                  </div>
                  <p className="text-lg font-semibold text-gray-400">
                    No Member Yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/*Dialog for Admin Profile*/}
      
    </div>
  );
};

export default GroupCard;
