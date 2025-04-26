import express  from "express";
import { assignAdmin,  confirmShopRequest,  deleteUser,  getAdmins, getAllShopRequests, getCustomers,  getUsers, rejectmShopRequest, resignAdmin } from "../controllers/admin.controller.js";


const router = express.Router();
router.get('/getadmins', getAdmins);
router.get('/getcustomers', getCustomers);
router.delete("/delete/:id" , deleteUser);
router.get('/getusers', getUsers);
router.put("/assignadmin/:id" ,  assignAdmin);
router.put("/resignadmin/:id" , resignAdmin);
router.get("/getshoprequest", getAllShopRequests);
router.put("/confirmrequest/:id", confirmShopRequest);
router.put("/rejectrequest/:id", rejectmShopRequest);


export default router;