import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Lottie from "react-lottie";
import { animationDefaultOptionns } from "@/lib/utils";
import { apiClient } from "../../../../../lib/api-client.js";
import { SEARCH_CONTACTS_ROUTES } from "../../../../../utils/constants.js";
import { Avatar, AvatarImage } from "../../../../../components/ui/avatar.jsx";
import { getColor } from "../../../../../lib/utils.js";
import { useAppStore } from "../../../../../store/store.js";

function NewDm() {
  const {setSelectedChatData, setSelectedChatType} = useAppStore();
  const [OpenNewContactModal, setOpenNewContactModal] = useState(false);
  const [SearchedContacts, setSearchedContacts] = useState([]);

  const SearchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Buddies
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={OpenNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              Please select a buddy
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Buddies"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => SearchContacts(e.target.value)}
            />
          </div>
          {SearchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {SearchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={()=>{selectNewContact(contact)}}
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                            contact.color
                          )} `}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName}  ${contact.lastName}`
                        : ""}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          )}
          
          {SearchedContacts.length <= 0 && (
            <div className="flex-1 bg-[#181920] mt-5 md:mt-0 md:flex flex-col justify-center items-center  duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptionns}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  Search new
                  <span className="text-purple-500"> Buddy. </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewDm;
