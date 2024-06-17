
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import cookieParser from 'cookie-parser';
import { mongooseConnection } from './src/config/mongoose';
import { cloudinaryConfig } from './src/utils/cloudinary';
import userRouter from './src/routes/userRouter';
import postRouter from './src/routes/postRouter';
import { pgConnection } from './src/config/psql';
import adminRouter from './src/routes/adminRouter';
import socketIo_Config from './src/sockets/socket';
import { startBirthdayCron } from './src/utils/birthdayCron';

// Create an Express app
const app = express();
const server = new Server(app);

// Initialize Socket.IO
const io = new SocketServer(server, {
  cors: { origin: "*" }
});

// Configure Socket.IO
socketIo_Config(io);

// Initialize database connections
pgConnection();
mongooseConnection();
cloudinaryConfig();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
}));

// Routes
app.use('/user', userRouter,postRouter);
app.use('/admin', adminRouter);

import './src/utils/birthdayCron'

// Start the server

const port = process.env.LISTENING_PORT || 3000;
server.listen(port, () => {
  console.log('Server is running on port', port);
});

// Start birthday cron job
startBirthdayCron(io);
