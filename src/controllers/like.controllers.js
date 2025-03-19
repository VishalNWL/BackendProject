import { Like } from "../Models/likes.model.js"
import mongoose ,{ isValidObjectId } from "mongoose"
import {asyncHandler} from "../Utils/asyncHandler.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import { ApiError } from "../Utils/Apierrors.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(videoId)){throw new ApiError(400,"Invalid video id")};

    //Cheking if already like already exist

    const liked=await Like.findOneAndDelete({
       video:mongoose.Types.ObjectId(videoId),
       likedBy:req.user._id
    })

    if(liked){
        res.status(200)
        .json(new Apiresponse(200,liked,"Video desliked Successfully"));
    }

    const newlike=await Like.create({
        video:mongoose.Types.ObjectId(videoId),
        likedBy:req.user._id
    })

    res.status(200)
    .json(new Apiresponse(200,newlike,"Liked successfully"));
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(commentId)){throw new ApiError(400,"Invalid comment id")};

    //Cheking if already like already exist

    const liked=await Like.findOneAndDelete({
       comment:mongoose.Types.ObjectId(commentId),
       likedBy:req.user._id
    })

    if(liked){
        res.status(200)
        .json(new Apiresponse(200,liked,"comment desliked Successfully"));
    }

    const newlike=await Like.create({
        comment:mongoose.Types.ObjectId(commentId),
        likedBy:req.user._id
    })

    res.status(200)
    .json(new Apiresponse(200,newlike,"Liked successfully"));

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(tweetId)){throw new ApiError(400,"Invalid tweet id")};

    //Cheking if already like already exist

    const liked=await Like.findOneAndDelete({
       tweet:mongoose.Types.ObjectId(tweetId),
       likedBy:req.user._id
    })

    if(liked){
        res.status(200)
        .json(new Apiresponse(200,liked,"tweet desliked Successfully"));
    }

    const newlike= await Like.create({
        tweet:mongoose.Types.ObjectId(tweetId),
        likedBy:req.user._id
    })

    res.status(200)
    .json(new Apiresponse(200,newlike,"Liked successfully"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    if(!req.user._id){
        throw new ApiError(400,"User not logged in");
    }
    // const LikedVideos=await Like.aggregate([
    //     {
    //         $match:{
    //             likedBy:req.user._id,
    //             targetType:"video"
    //         }
    //     },
    //     {
    //         $lookup:{
    //             from:"Video",
    //             localField:"video",
    //             foreignField:"_id",
    //             as:"LikedVideo",
    //             pipeline:[
    //                 { 
    //                     $lookup:{
    //                         from:"User",
    //                         localField:"owner",
    //                         foreignField:"_id",
    //                         as:"videoOwner"
    //                     },
                        
    //                 },{
    //                     $project:{
    //                         avatar:1,
    //                         username:1
    //                     }
    //                 }

    //             ]
    //         }
    //     },
    //     {
    //         $project:{
    //             thumbnail:1,
    //             description:1,
    //             title:1,
    //             duration:1,
    //             avatar:1,
    //             username:1
    //         }
    //     }
    // ])

    const likedvideo=await Like.find({
        likedBy:req.user._id,
        video:{$exist:true}
    }).populate("video","_id title videoFile")

    if(!likedvideo){throw new ApiError(400,"User didn't like any video")}

    res.status(200)
    .json(new Apiresponse(200,likedvideo,"Liked Video fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}