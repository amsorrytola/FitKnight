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
  const {userInfo, setUserInfo} = useAppStore();
  const [loding, setLoading] = useState(true);

  useEffect(()=>{
    const getUserData = async() => {
      try {
        const response = await apiClient.get(GET_USER_INFO,{withCredentials: true});
        if(response.status===200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response});
        
      } catch (error) {
        setUserInfo(undefined)
        console.log({error});
      }finally{
        setLoading(false);
      }
    };
    if(!userInfo){
      getUserData();
    }else{
      setLoading(false);
    }

  },[userInfo, setUserInfo]);

  if(loding) {return <div>Loading...</div>}

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
        <Route path="/chat" element={<Chat />} />
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
