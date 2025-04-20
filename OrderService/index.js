import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

//routes import
import orderRoute from "./routes/order.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cookieParser());
app.use(express.json());

app.listen(4001, () => {
  console.log("Server is Running on Port 4001");
});

const corsOptions = {
  origin: " http://localhost:5173/",
  credentials: true,
};
app.use(cors(corsOptions));

//api call
app.use("/api/order", orderRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
