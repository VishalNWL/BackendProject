import mongoose from "mongoose";
import {DB_Name} from "../constants.js"

const dbconnection=async ()=> {
    try {
        const dbconnectioninstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log(`${dbconnectioninstance.connection.host}`);
        console.log("Connections successfull");
    } catch (error) {
        console.log("MONGODB conneciton error",error);
        process.exit(1);
    }
}

export default dbconnection;