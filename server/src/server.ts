import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import connectDB from './config/db.config.js';
import authRoute from './routes/auth.route.js';
import tokenRoute from './routes/token.route.js';
import deviceRoute from './routes/device.route.js';
import dashboardRoute from './routes/dashboard.route.js';

dotenv.config({
  path:'./.env'
});

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {res.send('server is running...');});
app.use('/api/auth',authRoute);
app.use('/api/token',tokenRoute);
app.use('/api/device',deviceRoute);
app.use('/api/dashboard',dashboardRoute);

const PORT=process.env.PORT;

app.listen(PORT, async() => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});