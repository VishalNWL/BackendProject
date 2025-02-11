import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema=new mongoose.Schema({
   username:{
     type:String,
     required:true,
     lowercase:true,
     unique:true,
     trim:true,
     index:true
   },
   fullname:{
     type:String,
     required:true,
     trim:true,
     index:true
   },
   avatar:{
    type:String,//coudinary url
    required:true,

   },

   coverImage:{
    type:String //cloudinary url
   },

   watchHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
   ],
   password:{
     type:String,
     required:[true,"Password is required"]
   },

   refreshToken:{
    type:String
   }
},{timestamps:true})

userSchema.pre("save",async function(next) {

    if(!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,10)
    next();
})

//here we added our own method
userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password)
}
export const User=mongoose.model("User",userSchema)