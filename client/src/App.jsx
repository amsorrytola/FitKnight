import React, { Children, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import Chat from "./pages/chat/Chat.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { useAppStore } from "./store/store.js";
import { GET_USER_INFO } from "./utils/constants.js";
import { apiClient } from "./lib/api-client.js";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const { userInfo, setUserInfo, squireInfo, setSquireInfo, knightInfo, setKnightInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
  
        if (response.status === 200 && response.data.user) {
          const { user, squire, knight } = response.data;
  
          // Set base user info
          setUserInfo(user);
  
          // Set role-specific data
          if (user.role === "Squire" && squire) {
            setSquireInfo(squire);
            setKnightInfo(null); // Clear Knight info if switching roles
          } else if (user.role === "Knight" && knight) {
            setKnightInfo(knight);
            setSquireInfo(null); // Clear Squire info if switching roles
          }
        } else {
          // Clear state if no user data is returned
          setUserInfo(null);
          setSquireInfo(null);
          setKnightInfo(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserInfo(null);
        setSquireInfo(null);
        setKnightInfo(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo, setSquireInfo, setKnightInfo]);
  

  if (loading) {
    return <div>Loading...</div>;
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
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
