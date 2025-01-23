import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../../store/store";
import { toast } from "sonner";
import Logo from "../../assets/Gotham_Knights_Logo.svg.png";
import ChatIcon from "../../assets/ChatIcon.png";
import NotificationIcon from "../../assets/Notification.png";
import ReelIcon from "../../assets/ReelIcon.png";
import LogOutIcon from "../../assets/LogOut.png";
import { HOST, LOGOUT_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { apiClient } from "../../lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import BuddyList from "./components/BuddyList";
import GroupList from "./components/GroupList";
import Notifications from "./components/Notifications";
import {
  GET_RECOMMENDED_BUDDIES,
  GET_ALL_NOTIFICATIONS,
  ADD_GROUP_PROFILE_IMAGE_ROUTE,
  REMOVE_GROUP_PROFILE_IMAGE_ROUTE,
  GET_MEMBER_INFO,
  GET_USER_INFO,
  UPDATE_GROUP_INFO,
  CREATE_CHANNEL_ROUTE,
} from "../../utils/constants";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CreatableSelect from "react-select/creatable";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import { predefinedOptions } from "../../utils/constants/predefinedOptions";
import LocationPicker from "../../components/ui/LocationPicker.jsx";


function DashboardKnight() {
  const {
    userInfo,
    setUserInfo,
    addNotification,
    setUnreadCount,
    unreadCount,
    knightInfo,
    channelInfo,
    setChannelInfo,
    setKnightInfo,
    setSquireInfo,
    addChannel
  } = useAppStore();
  const [isNotificatioOpen, setIsNotificatioOpen] = useState(false);
  const [isGroupProfileActive, setIsGroupProfileActive] = useState(false);
  const [group, setGroup] = useState(null);
  const [hovered, sethovered] = useState("");
  const [membersInfo, setMembersInfo] = useState([]);
  const [open, setOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [createGroupName, setCreateGroupName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    console.log("knights Chaneel Info", channelInfo);
    console.log("KnightInfo",knightInfo);
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

    // Fetch notifications on load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(GET_ALL_NOTIFICATIONS, {
          params: { Id: knightInfo.knightId },  // Use params for GET requests
          withCredentials: true,
        });
        
        console.log("Notification response:", response);
        const { notifications, unreadCount } = response.data;
    
        notifications.forEach((notification) => addNotification(notification));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    

    fetchNotifications();
  }, [addNotification, setUnreadCount]);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      formData.append("channelId", group._id);
      console.log("formdata", formData);
      const response = await apiClient.post(
        ADD_GROUP_PROFILE_IMAGE_ROUTE,
        formData,
        { channelId: group._id }
      );
      if (response.status === 200 && response.data.image) {
        setGroup({ ...group, image: response.data.image });
        toast.success("Image updated successfully");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(
        REMOVE_GROUP_PROFILE_IMAGE_ROUTE,
        { channelId: group._id }
      );
      if (response.status === 200) {
        setGroup({ ...group, image: null });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "15px", // Fully rounded corners
      padding: "6px", // Adds padding for better spacing
      border: "1px solid #ccc", // Default border color
      boxShadow: "none", // Removes default focus shadow
      backgroundColor: "#2c2e3b",
      "&:hover": {
        borderColor: "#888", // Changes border color on hover
      },
      "&:focus": {
        outline: "none",
        ring: "4px",
        ringColor: "purple-500",
        borderColor: "transparent",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "white", // White text for placeholder
    }),
    multiValue: (base) => ({
      ...base,
      borderRadius: "9999px", // Rounded tags for selected items
      backgroundColor: "#e2e8f0", // Light gray background for tags
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#333", // Text color for tags
    }),
    multiValueRemove: (base) => ({
      ...base,
      borderRadius: "9999px", // Rounded remove button
      "&:hover": {
        backgroundColor: "#f87171", // Red background on hover
        color: "white",
      },
    }),
  };

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

  
  const handleSaveChange = async () => {
    try {
      console.log("Le", group);
      const response = await apiClient.post(UPDATE_GROUP_INFO, { group });
      console.log(response.data);
      getUserData();
      setIsGroupProfileActive(false);
    } catch (error) {
      console.error("ERROR", error.response?.data || error.message);
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!createGroupName.trim() || !knightInfo?.knightId) {
        throw new Error("Group name and admin ID are required");
      }
  
      const response = await apiClient.post(
        CREATE_CHANNEL_ROUTE,
        { name: createGroupName, admin: userInfo.id },
        { withCredentials: true } // Ensuring cookies or tokens are sent
      );
  
      console.log("Channel created:", response.data);
      getUserData(); // Refresh user data
  
      setGroup(response.data.channel);
      setIsGroupProfileActive(true);
      setCreateGroupOpen(false);
      addChannel(response.data.channel);
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="bg-[#1b1c24] w-screen h-screen flex flex-col items-center ">
      <div className="w-[100%] h-[10%] border-b-4 border-purple-500 flex justify-between items-center p-1">
        <div className="h-[100%]">
          <img src={Logo} alt="logo" className="h-[100%]" />
        </div>

        <div className="flex items-center justify-end h-full mr-5 gap-5">
          {/* Logout Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={LogOutIcon}
                  alt="Log Out"
                  className="h-[90px] w-[90px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={logOut}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1c1e] border-none text-white">
                Log Out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* Reel Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={ReelIcon}
                  alt="Reels"
                  className="h-[90px] w-[90px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={() => {
                    navigate("/reels");
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1c1e] border-none text-white">
                Reels
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notification Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={NotificationIcon}
                  alt="Notifications"
                  className="h-[90px] w-[90px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={() => {
                    setIsNotificatioOpen(true);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1c1e] border-none text-white">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={isNotificatioOpen} onOpenChange={setIsNotificatioOpen}>
            <DialogContent className="max-w-lg rounded-lg shadow-xl">
              <Notifications />
            </DialogContent>
          </Dialog>
          {unreadCount > 0 ? (
            <div className="absolute right-[260px] top-[20px] rounded-full bg-red-500 h-[30px] w-[30px] text-white flex justify-center items-center">
              {unreadCount}
            </div>
          ) : (
            <div className="absolute"></div>
          )}

          {/* Chat Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={ChatIcon}
                  alt="Chat"
                  className="h-[90px] w-[90px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={() => {
                    navigate("/chat");
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1c1e] border-none text-white">
                Chat
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Profile */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {userInfo.image ? (
                  <img
                    src={`${HOST}/${userInfo.image}`}
                    alt="Profile"
                    className="h-[90px] w-[90px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  />
                ) : (
                  <div
                    className="h-[90px] w-[90px] rounded-full bg-gray-500 text-white flex items-center justify-center text-lg font-bold hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    {userInfo.firstName
                      ? userInfo.firstName.charAt(0)
                      : userInfo.email.charAt(0)}
                  </div>
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-[#1c1c1e] border-none text-white">
                Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="h-[45%] w-[97%] border-b-2 border-gray-500 flex flex-col p-2 items-center">
        {isGroupProfileActive ? (
          <div className="w-[100%] h-[100%]">
            <div className="h-[15%] w-full border-b-4 border-gray-600 flex justify-between items-center  bg-[#1b1c24] shadow-md">
              <h1 className="text-[60px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-md">
                {group.name}
              </h1>

              <button
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110"
                onClick={handleSaveChange}
              >
                Save Changes
              </button>
            </div>
            <div className="h-[85%] w-full flex justify-between items-center  p-6 bg-[#1a1c23] rounded-lg shadow-lg">
              {/* Group Profile Image Section */}
              <div
                className="relative flex flex-col items-center justify-center h-[400px] w-[400px] "
                onMouseEnter={() => sethovered(true)}
                onMouseLeave={() => sethovered(false)}
              >
                <Avatar className="h-full w-full rounded-full overflow-hidden border-4 border-purple-600 shadow-xl">
                  {group.image ? (
                    <AvatarImage
                      src={`${HOST}/${group.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div className="uppercase text-5xl flex items-center justify-center h-full w-full bg-gray-700 text-white rounded-full font-bold">
                      {group.name.charAt(0)}
                    </div>
                  )}
                </Avatar>

                {hovered && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-100 rounded-full cursor-pointer transition-all"
                    onClick={
                      group.image ? handleDeleteImage : handleFileInputClick
                    }
                  >
                    {group.image ? (
                      <FaTrash className="text-white text-3xl cursor-pointer" />
                    ) : (
                      <FaPlus className="text-white text-3xl cursor-pointer" />
                    )}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  name="profile-image"
                  accept=".png, .jpg, .jpeg, .svg, .webp"
                />
              </div>

              {/* Group Info Inputs */}
              <div className="w-[400px]  space-y-10">
                <input
                  placeholder="Group Name"
                  type="text"
                  value={group.name}
                  onChange={(e) => setGroup({ ...group, name: e.target.value })}
                  className="w-full border border-gray-600 text-white focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-md rounded-lg p-3 bg-[#2c2e3b] placeholder-gray-400"
                />
                <textarea
                  name="description"
                  value={group.description}
                  onChange={(e) =>
                    setGroup({ ...group, description: e.target.value })
                  }
                  placeholder="Group Description"
                  className="w-full border border-gray-600 text-white focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-md rounded-lg p-3 bg-[#2c2e3b] placeholder-gray-400 resize-none min-h-20"
                ></textarea>
              </div>

              <div className="w-[600px] space-y-10 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CreatableSelect
                    isMulti
                    options={predefinedOptions.activityType}
                    value={group.activityType.map(({ value, label }) => ({
                      value,
                      label,
                    }))}
                    onChange={(newValue) =>
                      setGroup({ ...group, activityType: newValue })
                    }
                    placeholder="Select or add Activity Type"
                    styles={selectStyles}
                  />
                  <CreatableSelect
                    isMulti
                    options={predefinedOptions.schedule.map(
                      ({ value, label }) => ({
                        value,
                        label,
                      })
                    )}
                    value={group.schedule}
                    onChange={(newValue) =>
                      setGroup({ ...group, schedule: newValue })
                    }
                    placeholder="Select or add Schedule"
                    styles={selectStyles}
                  />
                </div>

                {/* Location Picker */}
                <div className="w-full flex items-center bg-[#2c2e3b] border border-gray-600 rounded-r-full shadow-md mt-4">
                  <input
                    type="text"
                    placeholder="Set Your Location"
                    value={group.address}
                    readOnly
                    className="w-full p-3 bg-[#2c2e3b] text-white placeholder-gray-400 focus:outline-none"
                  />
                  <div className="w-[60%] h-fit">
                    <LocationPicker
                      onLocationChange={(newLocation) =>
                        setGroup({ ...group, location: newLocation })
                      }
                      onAddressChange={(newAddress) =>
                        setGroup({ ...group, address: newAddress })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div>
              

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
                            onClick={() => setOpen(true)}
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
                <div className="text-gray-400 text-sm mt-4">
                  <strong>Created On:</strong>{" "}
                  {new Date(group.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center space-y-6">
            <div className="relative flex flex-col items-center">
              {userInfo.image ? (
                <img
                  src={`${HOST}/${userInfo.image}`}
                  alt="Profile"
                  className="h-[150px] w-[150px] rounded-full text-white hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={() => {
                    navigate("/profile");
                  }}
                />
              ) : (
                <div
                  className="h-[150px] w-[150px] rounded-full bg-gray-500 text-white flex items-center justify-center text-lg font-bold hover:outline-none hover:ring-4 hover:ring-purple-500 shadow-sm hover:shadow-lg transition duration-200"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  {userInfo.firstName
                    ? userInfo.firstName.charAt(0)
                    : userInfo.email.charAt(0)}
                </div>
              )}
              <h1 className="mt-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-md">
                Welcome, {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-lg text-gray-400 mt-2">
                "{userInfo.shortDescription}"
              </p>
            </div>

            <div className="flex space-x-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-60">
                <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                  Achievements
                </h2>
                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
                  {knightInfo.achievements.map((ach, index) => (
                    <div key={index} className="text-gray-300 mb-2">
                      <p className="font-medium">{ach.title}</p>
                      <p className="text-sm">
                        {new Date(ach.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-60">
                <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                  Qualifications
                </h2>
                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
                  {knightInfo.qualifications.map((qual, index) => (
                    <div key={index} className="text-gray-300 mb-2">
                      <p className="font-medium">{qual.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="h-[45%] w-[97%] flex flex-col p-2 items-center">
        <div className="h-[15%] w-full border-b-4 border-gray-600 flex flex-row-reverse justify-between items-center  bg-[#1b1c24] shadow-md">
          {/* Heading */}
          <h1 className="text-[60px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-md">
            Your Groups
          </h1>

          {/* Advanced Search Button */}
          <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
            <DialogTrigger className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110">
              Create Group
            </DialogTrigger>
            <DialogContent className="w-full max-w-lg bg-[#2c2f3a] rounded-xl shadow-2xl p-6 text-white">
              <h2 className="text-2xl font-bold text-center text-gray-200 mb-4">
                Create New Group
              </h2>

              <div className="space-y-4">
                <input
                  placeholder="Group Name"
                  type="text"
                  value={createGroupName}
                  onChange={(e) => setCreateGroupName(e.target.value)}
                  className="w-full border border-gray-700 text-white focus:ring-4 focus:ring-purple-500 focus:border-transparent shadow-md rounded-lg p-3 bg-[#2c2e3b] placeholder-gray-400 focus:outline-none"
                />

                <div className="flex justify-end">
                  <button
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg text-md font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    onClick={handleCreateGroup}
                  >
                    Create
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="w-full flex justify-center items-center p-6 mt-5 mx-5">
          <Carousel
            opts={{
              align: "start",
              loop: true, // Enable looping for smooth experience
              duration: 20, // Smooth sliding
            }}
            className="w-full mx-5"
          >
            <CarouselContent className="flex gap-6">
              {channelInfo.map((channel, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
                  <div className="p-4">
                    <Card className="relative w-[360px] max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-lg rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 scale-100 hover:scale-105 duration-300">
                      {/* Members Count Badge */}
                      <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 text-sm rounded-full shadow-md">
                        {channel.members.length} Members
                      </div>

                      {/* Profile Picture or Initial */}
                      {channel?.image ? (
                        <img
                          src={`${HOST}/${channel.image}`}
                          alt={channel.name}
                          className="h-28 w-28 rounded-full object-cover border-4 border-purple-500 shadow-md hover:border-purple-400 transition-all"
                        />
                      ) : (
                        <div className="h-28 w-28 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-500 shadow-md">
                          {channel.name.charAt(0)}
                        </div>
                      )}

                      {/* Channel Info */}
                      <div className="text-center mt-5 space-y-3 text-gray-300">
                        <h2 className="text-xl font-bold text-purple-400">
                          {channel.name}
                        </h2>
                        <p className="text-sm text-gray-400 flex flex-col">
                          Description:{" "}
                          <span className="text-white font-medium">
                            {channel.description || "No Description"}
                          </span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center mt-8 gap-3 w-full">
                        {isGroupProfileActive ? (
                          <></>
                        ) : (
                          <button
                            className="px-5 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg "
                            onClick={() => {
                              setIsGroupProfileActive(true);
                              setGroup(channel);
                              getMembers();
                              console.log("channel", channel);
                              console.log("members", membersInfo);
                            }}
                          >
                            View Group Details
                          </button>
                        )}

                        <button className="px-5 py-2 bg-gray-700 text-white rounded-full text-sm font-semibold hover:bg-gray-600 transition-all shadow-md hover:shadow-lg">
                          See Messages
                        </button>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Navigation */}
            <CarouselPrevious className="text-white bg-purple-700 hover:bg-purple-900" />
            <CarouselNext className="text-white bg-purple-700 hover:bg-purple-900" />
          </Carousel>
        </div>

        <div>
          {/*<GroupList groups={groups} loading={loadingGroups} fetchMoreGroups={fetchMoreGroups} />*/}
        </div>
      </div>
    </div>
  );
}

export default DashboardKnight;
