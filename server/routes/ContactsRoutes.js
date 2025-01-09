import {Router} from "express";
import {verifyToken} from "../middlewares/AuthMiddleWare.js";
import { searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search",verifyToken, searchContacts);

export default contactsRoutes;