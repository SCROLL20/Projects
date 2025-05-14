//* Import necessary modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";



//* Import the router from the routes folder
import router from './routes/user.route.js';
import dbConnect from './config/mongoose.config.js';
import postRouter from './routes/post.route.js';
import likeRouter from './routes/like.route.js';


//* Create an instance of express application
const app = express();


//* Configure the middlewares
app.use(express.json(),cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
app.use(cookieParser());

//* Load the server port from environment variables
dotenv.config();


//* Retrives the server port from .env
const PORT = process.env.PORT;


//* Connect to the MONGODB database
dbConnect();

//* Add main routes for app running
app.use("/api", router);
app.use("/api",postRouter);
app.use("/api", likeRouter);
//* Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Log server URL to the console
  });
  