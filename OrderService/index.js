import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";


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

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost',
  'http://frontend',
  'http://frontend.bakery-shop'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

//api call
app.use("/api/order", orderRoute);

app.get("/", (req, res) => {
  res.send("orser service API is working!");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
