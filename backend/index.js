import express from 'express';
import dotenv from 'dotenv';
import profileRoutes from './src/routes/profileRoute.js'
import eventRoutes from './src/routes/eventRoutes.js'
import connectDB from './src/config/db.js';
import cors from 'cors'

dotenv.config();

const app=express();
connectDB();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(profileRoutes);
app.use(eventRoutes);

app.listen(5000,()=>{
    console.log("Server is listening on port 5000");
});