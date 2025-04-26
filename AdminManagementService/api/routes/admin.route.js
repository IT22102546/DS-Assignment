import express  from "express";
import { assignAdmin,  confirmRiderRequest,  confirmShopRequest,  deleteUser,  getAdmins, getAllRideRequests, getAllShopRequests, getCustomers,  getRiders,  getUsers, rejectmShopRequest, rejectRiderRequest, resignAdmin } from "../controllers/admin.controller.js";


const router = express.Router();
router.get('/getadmins', getAdmins);
router.get('/getcustomers', getCustomers);
router.get('/getriders', getRiders);
router.delete("/delete/:id" , deleteUser);
router.get('/getusers', getUsers);
router.put("/assignadmin/:id" ,  assignAdmin);
router.put("/resignadmin/:id" , resignAdmin);
router.get("/getshoprequest", getAllShopRequests);
router.put("/confirmrequest/:id", confirmShopRequest);
router.put("/rejectrequest/:id", rejectmShopRequest);
router.get("/getriderequest", getAllRideRequests);
router.put("/confirmRiderrequest/:id", confirmRiderRequest);
router.put("/rejectRiderrequest/:id", rejectRiderRequest);


export default router;