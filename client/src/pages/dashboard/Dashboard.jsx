import React, { useEffect } from 'react'
import { useAppStore } from '../../store/store'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Dashboard() {
    const {userInfo} = useAppStore();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!userInfo.profileSetup){
            toast("Please setup profile to continue");
            navigate("/profile");
        }
    },[userInfo,navigate])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard