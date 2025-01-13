export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels : [],
  setChannels: (channels)=> set({channels}),
  setIsUploading: (isUploading) => set({isUploading}),
  setIsDownloading: (isDownloading)=> set({isDownloading}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
  setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setDirectMessagesContacts: (directMessagesContacts) =>
    set({ directMessagesContacts }),
  addChannel: (channel) => {
    const channels = get().channels;
    set({channels: [channel, ...channels]});
  },
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  addMessages: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel)=> channel._id === message.channelId);
    const index = channels.findIndex((channel)=> channel._id === message.channelId);
    if(index !== -1 && index !== undefined){
      channels.splice(index,1);
      channels.unshift(data);
    }
  },
  addContactsInDMContacts: (message) => {

    const userId = get().userInfo.id;
    const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
    const formData = message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMessagesContacts;
    const data = dmContacts.find((contact)=> contact._id === fromId);
    const index = dmContacts.findIndex((contact)=> contact._id === fromId);

    if(index !== -1 && index !== undefined){
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    }else{
      dmContacts.unshift(formData);
    }
    set({directMessagesContacts: dmContacts});
  }
});
