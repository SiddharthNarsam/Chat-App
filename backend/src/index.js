// const express = require("express");

import express, { json } from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js"



const app = express();

dotenv.config();

const PORT= process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})