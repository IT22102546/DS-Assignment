import express from "express";
import {
  createOrder,
  deleteOrder,
  FinishOrder,
  getAllOrders,
  getAllOrderShop,
  getMyOrder,
  getOrder,
  getOrdersByCustomerId,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Customer order handling routes
router.post("/create", createOrder);
router.get("/getorders", getAllOrders);
router.get("/getordershop", getAllOrderShop);
router.get("/getorder/:id", getOrder);
router.delete("/deleteorder/:id", deleteOrder);
router.put("/update-status/:orderId", updateOrderStatus);
router.put("/finish-delivery/:orderId", FinishOrder);

router.get("/customer/:id", getOrdersByCustomerId);
router.get("/getmyorder/:userId", getMyOrder);

export default router;
