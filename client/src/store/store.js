import { createAuthSlice } from "./slice/authSlice";
import {create} from "zustand";
import { createChatSlice } from "./slice/chatSlice";
import { createNotificationSlice } from "./slice/NotificationSlice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
    ...createNotificationSlice(...a),
}));
