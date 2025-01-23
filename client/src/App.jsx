import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import Chat from "./pages/chat/Chat.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import DashboardKnight from "./pages/dashboard/DashboardKnight.jsx";
import { useAppStore } from "./store/store.js";
import { GET_USER_INFO } from "./utils/constants.js";
import { apiClient } from "./lib/api-client.js";

// Private Route to check authentication
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

// Redirect to dashboard if already authenticated
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const {
    userInfo,
    setUserInfo,
    squireInfo,
    setSquireInfo,
    knightInfo,
    setKnightInfo,
    setChannelInfo,
  } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        console.log("Fetching user data...");
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        console.log("API Response:", response);

        if (response.status === 200 && response.data.user) {
          const { user, squire, knight, channels } = response.data;
      
          console.log("User",user);
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
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [setUserInfo, setSquireInfo, setKnightInfo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-dotted rounded-full animate-spin"></div>
          <div className="absolute w-12 h-12 border-4 border-purple-300 border-dotted rounded-full animate-ping"></div>
        </div>
        <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
          "Loading... Stay fit, stay strong!"
        </p>
      </div>
    );
  }
  

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            userInfo?.role === "Squire" ? (
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            ) : (
              <PrivateRoute>
                <DashboardKnight />
              </PrivateRoute>
            )
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
