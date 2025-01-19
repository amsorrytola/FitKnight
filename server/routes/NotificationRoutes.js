import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";
import { getNotifications, deleteNotification, markNotificationsAsRead } from "../controllers/NotificationController.js";

const notificationRoutes = Router();



notificationRoutes.get("/get-notifications", verifyToken,getNotifications);
notificationRoutes.post("/markAsRead-notifications", verifyToken,markNotificationsAsRead);
notificationRoutes.delete("/delete-notifications",verifyToken,deleteNotification); 


export default notificationRoutes;