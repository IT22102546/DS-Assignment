import express  from "express";
import { assignAdmin,  deleteUser,  getAdmins, getCustomers,  getUsers, resignAdmin } from "../controllers/admin.controller.js";


const router = express.Router();
router.get('/getadmins', getAdmins);
router.get('/getcustomers', getCustomers);
router.delete("/delete/:id" , deleteUser);
router.get('/getusers', getUsers);
router.put("/assignadmin/:id" ,  assignAdmin);
router.put("/resignadmin/:id" , resignAdmin);

export default router;