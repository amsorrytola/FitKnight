import { createAuthSlice } from "./slice/authSlice";
import {create} from "zustand";
import { createChatSlice } from "./slice/chatSlice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));
