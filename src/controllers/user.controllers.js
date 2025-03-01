import {asyncHandler} from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/Apierrors.js";
import {User} from "../Models/user.model.js"
import {uploadOnCloudinary} from "../Utils/cloudinary.js"
import { Apiresponse } from "../Utils/Apiresponse.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { jwtverify } from "../Middlewares/auth.middleware.js";


const generateAccessTokenAndRefreshToken=async (userid)=>{
  try {
    const user= await User.findById(userid);

    const refreshToken=user.generateRefreshToken();
    const accessToken=user.generateAcessToken();
    user.refreshToken=refreshToken;
    user.save({ validateBeforeSave:false});

    return {accessToken,refreshToken};

  } catch (error) {
    console.log(error);
      throw new ApiError(400,"Some error occured while generating accesstoken and accesstoken");
  }
}


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
 const {fullname,email,username,password}=req.body;
 
 if(
    [fullname,email,username,password].some((field)=>field?.trim()==="")
 ){
      throw new ApiError(400,"All fields are required");
 }
   
console.log(process.env.api_key)
//Now we have to find wheather the user is already exist or not
    // User.findOne({username}) Now this an querry to just check for only one parameter
    //but we want that if atleast one of username or email found
    
const userexisted=await User.findOne({
    $or:[{username,email}]
})
  
if(userexisted){
    throw new ApiError(409,"User with email or username already exists");
}

// Now lets store local path of avatar and coverimage got by multer
 const avatarlocalpath=req.files?.avatar[0]?.path;
 const coverImagelocalpath=req.files?.coverImage[0]?.path;

 if(!avatarlocalpath){
    throw new ApiError(400,"Avatar required 1"); 
 }
 console.log(avatarlocalpath,coverImagelocalpath);
 const avatar=await uploadOnCloudinary(avatarlocalpath);
 console.log(avatar);
 const coverImage= await uploadOnCloudinary(coverImagelocalpath);
 

 if(!avatar){
    throw new ApiError(400,"Avatar required 2");
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
   res.status(201).json(
      new Apiresponse(200,createduser,"User registered Succesfully")
  )
})


//Now Login user

const loginUser=asyncHandler(async (req,res)=>{
    //req body --password, email,username
    //check username and email
    //find the user
    //check password
    //generate refresh and access token
    //send response

    const {username,email,password}=req.body;

    const user= await User.findOne({
        $or:[{username},{email}]
    })

    if(!username && !email){
        throw new ApiError(400,"user not found");
    }

    const isPasswordvalid=await user.isPasswordCorrect(password);
    
    if(!isPasswordvalid){
        throw new ApiError(400,"Password is not correct");
    }
   
    const {accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id);

    const userloggedin=await User.findById(user._id).select("-password -refreshToken");


    const option={  //this will allow only server to apply crud operation on cookies frontend will only can see them
        httpOnly:true,
        secure:true,
    }

  res.status(200)
  .cookie("accessToken",accessToken,option)
  .cookie("refreshToken",refreshToken,option)
  .json({
     user:userloggedin,accessToken,refreshToken,
     message:"user logged in successfully"
  })
     
})


//Let's logout the user

const logoutUser=asyncHandler(async (req,res)=>{
     await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
     )

     const option={ 
        httpOnly:true,
        secure:true,
    }

    res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new Apiresponse(200,{},"Logged out successfully"));
})



export {registeruser,loginUser,logoutUser};