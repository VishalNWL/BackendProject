// import mongoose from "mongoose";
// import {DB_Name} from './constants.js';


import dotenv from "dotenv"
import express from "express";
import dbconnection from "./DB/index.js"

dotenv.config({
    path:'./.env'
})

const app=express();

dbconnection();











/*
//commented part is first approach to connect db and second method is to connect server into db folder then import here

(async ()=>{
   try {
   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
   app.on("error",(error)=>{
    console.log("Database is good but our application is not able to connect");
    throw error
   })

   app.listen(process.env.Port,()=>{
     console.log(`App is listening on port ${process.env.Port}`)
   })

   } catch (error) {
      console.error("ERROR: ",error)
      throw error
   }
})()

*/

