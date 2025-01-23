import React, { useEffect } from "react";
import ProfileInfo from "./components/ProfileInfo";
import NewDm from "./components/NewDm";
import { apiClient } from "../../../../lib/api-client";
import {
  GET_DM_CONTACTS_ROUTES,
  GET_USER_CHANNELS_ROUTE,
} from "../../../../utils/constants";
import { useAppStore } from "../../../../store/store";
import ContactList from "../../../../components/ContactList.jsx";
import CreateChannel from "./components/CreateChannel.jsx";
import Logo from "../../../../assets/Gotham_Knights_Logo.svg.png";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function ContactsContainer() {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    userInfo,
  } = useAppStore();
const navigate = useNavigate();
  useEffect(() => {
    const getContacts = async () => {
      const response = await apiClient.get(GET_DM_CONTACTS_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    };
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels, setDirectMessagesContacts]);
  return (
    <div className="relative md:w-[35vw] h-screen lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3 ">
        <div onClick={()=>{navigate("/dashboard")}}>
        <IoArrowBack className="mt-3 ml-2 text-2xl lg:text-4xl text-white cursor-pointer" />
        </div>
        <img src={Logo} alt="" className="h-[100px] w-[200px] ml-10" />
      </div>
      <div className="my-5 h-[35%]">
        <div className="flex items-center justify-between pr-10 ">
          <Title text="Fitness-Groups" />
          {/* <CreateChannel /> */}
        </div>
        <div className="h-[40%] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      {userInfo.role === "Squire" ? (
        <div className="my-5">
          <div className="flex items-center justify-between pr-10">
            <Title text="Fitness-Buddies" />
            {/* <NewDm /> */}
          </div>
          <div className="h-[40%] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </div>
      ) : null};
      <div className="mt-5">
      <ProfileInfo />

      </div>
    </div>
  );
}

export default ContactsContainer;

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
