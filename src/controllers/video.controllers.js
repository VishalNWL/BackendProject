import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../Models/video.model.js"
// import {User} from "../models/user.model.js"
import {ApiError} from "../Utils/Apierrors.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/asyncHandler.js"
import {uploadOnCloudinary} from "../Utils/cloudinary.js"
import { getVideoDuration } from "../Utils/ffmpeg.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query="", sortBy="createdAt", sortType="dec", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    
    if(!req.user){throw new ApiError(400,"User not logged in")};

    const AllVideos= await Video.aggregate([
        {
            $match:{
               ...(query?{title:{$regex:query,$options:"i"}}:{}), 
               ...(userId?{owner:mongoose.Types.ObjectId(userId)}:{})
            }
        },
        {
            $lookup:{
                from:"User",
                localField:"owner",
                foreignField:"_id",
                as:"videosByowner"
            }
        },
        {
            $project:{
                title:1,description:1,thumbnail:1,duration:1,videoFile:1,views:1,isPublished:1,
                owner:{
                    $arrayElementAt:["videosByowner",0]
                }
            }
        },
        {
            $sort:{
                [sortBy]:sortType==="dec"?-1:1
            }
        },
        {
            $skip:(page-1)*parseInt(limit)
        },
        {
            $limit:parseInt(limit)
        }
    ])

     if(AllVideos.length===0){
        throw new ApiError(404,"No video found with requested parameters");
     }

      res.status(200)
      .json(new Apiresponse(200,AllVideos,"ALl videos fetched successfully"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    const videolocalpath=req.files.videoFile[0]?.path;
    if(!videolocalpath){throw new ApiError(400,"No video found")};
    
    const thumbnaillocalpath= req.files.thumbnail[0].path;
    if(!thumbnaillocalpath){throw new ApiError(400,"No thumbnail found")};

    const thumbnail=await uploadOnCloudinary(thumbnaillocalpath);
    if(!thumbnail){throw new ApiError(500,"Some error occured while uploading thumbnail on cloudinary")};

    const videouploaded=await uploadOnCloudinary(videolocalpath);
    if(!videouploaded){throw new ApiError(500,"Some error occured while uploading video on cloudinary")};

    const duration=await getVideoDuration(videolocalpath);
    const video= await Video.create({
        videoFile:videouploaded.url,
        thumbnail:thumbnail.url,
        title:title,
        description:description,
        owner:req.user?._id,
        isPublished:true,
        duration:duration        
    })

    if(!video){
        throw new ApiError(500,"An error occured while uploading on database");
    }

    res.status(200)
    .json(new Apiresponse(200,video,"Video published successfully"));

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video=Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"video with give id not found");
    }
    
    res.status(200)
    .json(new Apiresponse(200,video,"Video fetched successfully"));
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title,description}=req.body;

    //checking if user is logged in or not
    if(!req.user){
        throw new ApiError(400,"user not logged in");
    }

    if(!isValidObjectId(videoId)) {throw new ApiError(400,"Invalid videoid")};

    const thumbnaillocalpath= req.files?.thumbnail.path;
  
    const thumbnailuploaded=await uploadOnCloudinary(thumbnaillocalpath)
                                  .catch(err=>{throw new ApiError(500,"There is something error while uploading")});

    
    const updatedvideo=await Video.findByIdAndUpdate(
        {_id:videoId, owner:req.user?._id},
        {
            $set:{
                thumbnail:thumbnailuploaded,
                description:description,
                title:title
            }
        },
        {
            new:true
        }
    ).catch(err=>{throw new ApiError(500,"Something wrong happended while updating the video")});

    res.status(200)
    .json(new Apiresponse(200,updatedvideo,"Video details updated successfully"));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoId is invalid");
    }

    if(!req.user){
        throw new ApiError(400,"user not logged in");
    }

    const deletedvideo=await Video.findOneAndDelete({_id:new mongoose.Types.ObjectId(videoId),owner:req.user._id});
    if(!deletedvideo){
        throw new ApiError(404,"No such video found");
    }

    res.status(200)
    .json(new Apiresponse(200,deletedvideo,"Video deleted successfully"));

})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"videoId is invalid");
    }

    if(!req.user){
        throw new ApiError(400,"user not logged in");
    }

    const publishstatus=await Video.findOneAndUpdate(
        {     _id:videoId,
             owner:req.user._id
        },
        {
            $set:{
                isPublished:!isPublished
            }
        },{
            new:true
        }
    )

    if(!publishstatus){
        throw new ApiError(404,"No such video found");
    }

     res.status(200)
     .json(new Apiresponse(200,publishstatus,`Video published status is toggeled successfully to ${publishstatus.isPublished}`));
    
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
