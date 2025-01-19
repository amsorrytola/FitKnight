import React, { useEffect, useState } from "react";
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
} from "../../components/ui/dialog";
import BuddyList from "./components/BuddyList";
import GroupList from "./components/GroupList";
import Notifications from "./components/Notifications";
import {
  GET_RECOMMENDED_BUDDIES,
  GET_ALL_NOTIFICATIONS,
} from "../../utils/constants";

function Dashboard() {
  const {
    userInfo,
    setUserInfo,
    addNotification,
    setUnreadCount,
    unreadCount,
  } = useAppStore();
  const [isNotificatioOpen, setIsNotificatioOpen] = useState(false);
  const [buddies, setBuddies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loadingBuddies, setLoadingBuddies] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [buddyPage, setBuddyPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  // Fetch initial buddies

  const fetchBuddies = async () => {
    try {
      setLoadingBuddies(true);
      const response = await apiClient.get(GET_RECOMMENDED_BUDDIES, {
        params: { page: buddyPage, limit: 5 },
        withCredentials: true,
      });
      console.log("LOL JI", response);
      setBuddies((prev) => [...prev, ...response.data]);
      console.log("LO BUDDIES", buddies);
    } catch (error) {
      console.error("Error fetching buddies:", error);
    } finally {
      setLoadingBuddies(false);
    }
  };

  useEffect(() => {
    fetchBuddies();
  }, [buddyPage]);

  // Fetch notifications on load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get(GET_ALL_NOTIFICATIONS, {
          withCredentials: true,
        });
        console.log("Notification response:", response);
        const notifications = response.data.notifications;

        notifications.forEach((notification) => addNotification(notification));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [addNotification, setUnreadCount]);

  // Fetch initial groups
  // useEffect(() => {
  //   const fetchInitialGroups = async () => {
  //     try {
  //       setLoadingGroups(true);
  //       const response = await apiClient.get(`/api/groups?page=${groupPage}`);
  //       setGroups((prev) => [...prev, ...response.data]);
  //     } catch (error) {
  //       console.error("Error fetching groups:", error);
  //     } finally {
  //       setLoadingGroups(false);
  //     }
  //   };

  //   fetchInitialGroups();
  // }, [groupPage]);

  const fetchMoreBuddies = () => {
    setBuddyPage((prev) => prev + 1);
    console.log("BUDDYPAGE", buddyPage);
  };

  // const fetchMoreGroups = () => {
  //   setGroupPage((prev) => prev + 1);
  // };
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
  console.log("LO BUDDIES", buddies);
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
        <div className="h-[15%] w-full border-b-4 border-gray-600 flex justify-between items-center  bg-[#1b1c24] shadow-md">
          {/* Heading */}
          <h1 className="text-[60px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-md">
            Buddies
          </h1>
                <div className="flex space-x-2">
          {/* Advanced Search Button */}
          <Dialog>
            <DialogTrigger className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110">
              Advanced Search
            </DialogTrigger>
            <DialogContent className="h-[80%] bg-[#2c2f3a] rounded-lg p-4 shadow-lg">
              {/* Add your advanced search form or content here */}
            </DialogContent>
          </Dialog>

          <button className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110"
          onClick={fetchMoreBuddies}>Recommend More</button>
          </div>
          
        </div>
        <div className="w-full    flex items-center justify-center">
          <BuddyList
            buddies={buddies}
            loading={loadingBuddies}
            fetchMoreBuddies={fetchMoreBuddies}
          />
        </div>
      </div>
      <div className="h-[45%] w-[97%] flex flex-col p-2 items-center">
        <div className="h-[15%] w-full border-b-4 border-gray-600 flex flex-row-reverse justify-between items-center  bg-[#1b1c24] shadow-md">
          {/* Heading */}
          <h1 className="text-[60px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 drop-shadow-md">
            Groups
          </h1>

          {/* Advanced Search Button */}
          <Dialog>
            <DialogTrigger className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110">
              Advanced Search
            </DialogTrigger>
            <DialogContent className="h-[80%] bg-[#2c2f3a] rounded-lg p-4 shadow-lg">
              {/* Add your advanced search form or content here */}
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {/*<GroupList groups={groups} loading={loadingGroups} fetchMoreGroups={fetchMoreGroups} />*/}
        </div>
      </div>

      <div className="border-l-2 border-gray-500 h-[38%] w-[2%] absolute right-0 top-[17%] flex flex-col items-center justify-center bg-[#1b1c24] shadow-lg  py-4">
        {[
          "O",
          "U",
          "R",
          " ",
          "R",
          "E",
          "C",
          "O",
          "M",
          "M",
          "E",
          "N",
          "D",
          "A",
          "T",
          "I",
          "O",
          "N",
          "S",
        ].map((letter, index) => (
          <p
            key={index}
            className={`text-gray-500 text-sm font-semibold tracking-wide ${
              letter === " " ? "h-6" : "" /* Add spacing for blank */
            }`}
          >
            {
              letter === " "
                ? "\u00A0"
                : letter /* Render a non-breaking space */
            }
          </p>
        ))}
      </div>
      <div className="border-r-2 border-gray-500 h-[38%] w-[2%] absolute left-0 bottom-0 flex flex-col items-center justify-center bg-[#1b1c24] shadow-lg  py-4">
        {[
          "O",
          "U",
          "R",
          " ",
          "R",
          "E",
          "C",
          "O",
          "M",
          "M",
          "E",
          "N",
          "D",
          "A",
          "T",
          "I",
          "O",
          "N",
          "S",
        ].map((letter, index) => (
          <p
            key={index}
            className={`text-gray-500 text-sm font-semibold tracking-wide ${
              letter === " " ? "h-6" : "" /* Add spacing for blank */
            }`}
          >
            {
              letter === " "
                ? "\u00A0"
                : letter /* Render a non-breaking space */
            }
          </p>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
