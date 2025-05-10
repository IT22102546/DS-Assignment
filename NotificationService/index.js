import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import emailRoutes from "./Routes/emailRoutes.js";

dotenv.config();
const app = express();

const port       = process.env.PORT;
const mongoURI   = process.env.MONGODBURL;

// parse JSON bodies
app.use(express.json());

// enable CORS for your frontend origin *before* mounting any routes
const corsOptions = {
  origin: 'http://localhost:5173',  // your React app
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS']
};
app.use(cors(corsOptions));

// now mount your routes
app.use('/email', emailRoutes);

// simple test route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// error-handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode
  });
});

// start server + connect to MongoDB
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connected!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
});
