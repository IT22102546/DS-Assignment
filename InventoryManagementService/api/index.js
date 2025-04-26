import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import inventoryRoute from "./routes/inventory.route.js";

dotenv.config();

const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB - retrying in 5 seconds', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

const app = express();


app.use(cookieParser());
app.use(express.json());


const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://frontend:5173',
    'http://localhost:4003' 
  ],
  credentials: true,
};
app.use(cors(corsOptions));


app.use("/api/inventory", inventoryRoute);

app.get("/", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Server is running successfully!",
  });
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});



app.listen(4003, '0.0.0.0', () => { 
  console.log('Server running on port 4003');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});