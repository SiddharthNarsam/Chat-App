// const express = require("express");

import express, { json } from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";


const app = express();

dotenv.config();

const PORT= process.env.PORT

app.use(express.json())


app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})