import {Router} from "express";
import { login, signup, getUserInfo, updateProfile, addProfileImage, removeProfileImage, logout, addBuddyToSquire,addGroupProfileImage, removeGroupProfileImage,updateGroupInfo } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleWare.js";
import multer from "multer";


const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/"})

authRoutes.post("/signup",signup);
authRoutes.post("/login",login);
authRoutes.get('/user-info',verifyToken, getUserInfo);
authRoutes.get('/members-info', getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post("/update-group-profile", updateGroupInfo);

authRoutes.post("/add-profile-image",verifyToken,upload.single("profile-image"),addProfileImage);
authRoutes.post("/add-group-profile-image",upload.single("profile-image"),addGroupProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.delete("/remove-group-profile-image",  removeGroupProfileImage);
authRoutes.post("/logout",logout);
authRoutes.post("/add-buddy",verifyToken,addBuddyToSquire);

export default authRoutes;