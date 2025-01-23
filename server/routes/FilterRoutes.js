import {Router} from "express";
import { getRecommendedBuddies,getRecommendedGroups } from "../controllers/FilterController.js";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";



const filterRoutes = Router();

filterRoutes.get("/buddies",verifyToken,getRecommendedBuddies);
filterRoutes.get("/groups",verifyToken,getRecommendedGroups);



export default filterRoutes;