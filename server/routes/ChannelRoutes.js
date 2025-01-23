import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleWare.js";
import { createChannel, getUserChannels,getChannelMessages, addMemberToChannel } from "../controllers/ChannelController.js";

const channelRoutes = Router();
channelRoutes.post("/create-channel",verifyToken,createChannel);
channelRoutes.get("/get-user-channels",verifyToken,getUserChannels);
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages);
channelRoutes.post("/add-member",addMemberToChannel);

export default channelRoutes;