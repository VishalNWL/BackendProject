// import mongoose from "mongoose";
// import {DB_Name} from './constants.js';


import dotenv from "dotenv"
dotenv.config({
    path:'./.env'
})
import {app} from "./app.js";
import dbconnection from "./DB/index.js"
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({ 
   cloud_name:process.env.cloud_name, 
   api_key:process.env.api_key, 
   api_secret:process.env.api_secret
});

dbconnection() 
.then(()=>{
     app.listen(process.env.PORT,()=>{
      console.log(`Server is listening on the port ${process.env.PORT}`)
     })
})
.catch((err)=>{
   console.log("There is some error in connecting with server");
})











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

