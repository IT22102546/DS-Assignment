import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { assignAdmin, deleteUser,forgetpassword,  getUser,  getUserById,  google, resetpassword, resignAdmin, signin, signout, signup, test, updateResetPassword, updateUser } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/test',test);
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google",google);
router.put("/update/:id" , verifyToken , updateUser);
router.delete("/delete/:id" , verifyToken , deleteUser);
router.put("/assignadmin/:id" , verifyToken , assignAdmin);
router.put("/resignadmin/:id" , verifyToken , resignAdmin);
router.get('/signout',signout);
router.post('/forgetpassword',forgetpassword);
router.get('/resetpassword/:id/:token',resetpassword);
router.post('/updateResetPassword/:id/:token',updateResetPassword);
router.get('/:userId', getUser);
router.get("/getuserById/:userId", getUserById);


export default router;