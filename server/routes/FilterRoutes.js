import {Router} from "express";
import { getRecommendedBuddies } from "../controllers/FilterController.js";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";



const filterRoutes = Router();

filterRoutes.get("/buddies",verifyToken,getRecommendedBuddies);

export default filterRoutes;