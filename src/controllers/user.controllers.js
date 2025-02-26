import {asyncHandler} from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/Apierrors.js";
import {User} from "../Models/user.model.js"
import {uploadOnCloudinary} from "../Utils/cloudinary.js"
import { Apiresponse } from "../Utils/Apiresponse.js";


const registeruser=asyncHandler(async(req,res)=>{
////////////steps to be followed while registering user

    //get user details from frontend
    //validation not empty
    //check if user already exits: username, email
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    //create user object create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res
    const {username,fullname,email,avatar,coverImage}=req.body;

    if(username.trim()===""){
        throw new ApiError(400,"Username required");
    }
    if(fullname.trim()===""){
        throw new ApiError(400,"fullname required");
    }
    if(email.trim()===""){
        throw new ApiError(400,"email required");
    }
    if(password.trim()===""){
        throw new ApiError(400,"Username required");
    }

//Now we have to find wheather the user is already exist or not
    // User.findOne({username}) Now this an querry to just check for only one parameter
    //but we want that if atleast one of username or email found
    
    const existuser=User.findOne({
        $or: [{username},{email}]
    })

    if(existuser){
        throw new ApiError(409,"User with email or username exist")
    }

// Now lets store local path of avatar and coverimage got by multer

  const avatarLocalpath=req.files?.avatar[0]?.path;
  const coverimageLocalpath=req.file?.coverImage[0]?.path;

  if(!avatarLocalpath){
    throw new ApiError(400,"Cover image required");
  }
})

const avatar=uploadOnCloudinary(avatarLocalpath);
const coverImage=uploadOnCloudinary(coverimageLocalpath);

if(!avatar){
    throw new ApiError(400,"Cover image required");
}

const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
})

//this is to check if user entry is created or not

const createduser=await User.findById(user._id).select( 
    "-password -refreshToken"    //in this these two field will not come after selection from db
);

if(!createduser){
    throw new ApiError(500,"Something went wrong while registering the user");
}

//Now we will send response
return res.status(201).json(
    new Apiresponse(200,createduser,"User registered Succesfully")
)

export {registeruser};