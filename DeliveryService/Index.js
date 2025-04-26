import express from 'express';
import  deliverRoute from "./Routes/Delivery.js"
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const app = express();

dotenv.config();
const port = process.env.PORT;
const mongoURI =process.env.MONGODBURL

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