import express from 'express';
import  deliverRoute from "./Routes/Delivery.js"
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from "cors";


dotenv.config();
const app = express();

app.use(express.json());
const port = process.env.PORT;
const mongoURI =process.env.MONGODBURL



const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

app.use("/api/delivery",deliverRoute)



// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);

  mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
  
  });
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});
export default app;