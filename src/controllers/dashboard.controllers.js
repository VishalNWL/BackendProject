import mongoose from "mongoose"
import {Video} from "../Models/video.model.js"
import {subscription} from "../Models/subscription.model.js"
import {Like} from "../Models/likes.model.js"
import {ApiError} from "../Utils/Apierrors.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/asyncHandler.js"
import { response } from "express"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId=req.params;
    if(!userId){throw new ApiError(400,"User not logged in")};
   
    const videosAndviews=await Video.aggregate([
        {
            $match:{
                $and:{
                    owner: new mongoose.Types.ObjectId(userId),
                    isPublished:true
                }
            },
            $group:{
                _id:null,
                totalViews:{$sum:"$views"},
                count:"totalVideos" //totalVideos:{$sum:1};
            }
        }
    ])

     // aggregate the total subscribers
     const totalSubs = await subscription.aggregate( [
        { $match: { channel: new mongoose.Types.ObjectId( channelID ) } },
        { $count: "totalSubcribers" } // Count the total subscribers
    ] )

    // aggregate the total tweets
    const totalTweets = await Tweet.aggregate( [
        { $match: { owner: new mongoose.Types.ObjectId( channelID ) } },
        { $count: "totalTweets" }
    ] )

    //  aggregate the total comments
    const totalComments = await Comment.aggregate( [
        { $match: { owner: new mongoose.Types.ObjectId( channelID ) } },
        { $count: "totalComments" }
    ] )
   
    //aggregate the total likes

    const totallikes=await Like.aggregate([
       { $match:{
             likedBy:new mongoose.Types.ObjectId(channelID)
          }
       },
       {
        count:"TotalVideoLikes"
       }
    ])
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {userId}=req.params;
    if(!req.user){
        throw new ApiError(400,"user not logged in ");
    }
   
  const channelvideo=await Video.find({owner:userId}).populate("owner","username email");
  if(!channelvideo){throw new ApiError(400,"No video found")};
  res.status(200)
  .json(new Apiresponse(200,channelvideo,"All videos fetched successfully"));
})

export {
    getChannelStats, 
    getChannelVideos
    }