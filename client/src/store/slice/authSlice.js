


export const createAuthSlice = (set) => ({
    userInfo: undefined,
    squireInfo: undefined,
    knightInfo: undefined,
    channelInfo: [],
    socket: undefined,
    setUserInfo: (userInfo) => set({userInfo}),
    setSquireInfo: (squireInfo) => set({squireInfo}),
    setKnightInfo: (knightInfo)=> set({knightInfo}),
    setChannelInfo: (channelInfo)=> set({channelInfo}),
    setSocket : (socket) => set({socket}),
})