import express from "express";
import {
  createSession,
  handleWebhook,
} from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/create-checkout-session", createSession);
//router.post("/create-booking-checkout-session", createBookingSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
