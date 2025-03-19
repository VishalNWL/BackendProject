import mongoose, {isValidObjectId, mongo, MongooseError} from "mongoose"
import {User} from "../Models/user.model.js"
import { subscription} from "../Models/subscription.model.js"
import {ApiError} from "../Utils/Apierrors.js"
import {Apiresponse, ApiResponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){throw new ApiError(400,"Invalid channelId")};
    if(!req.user){throw new ApiError(400,"User not logged in")};

    try {
        const subscribed=await subscription.findOneAndDelete({channel:mongoose.Types.ObjectId(channelId), subscriber:req.user._id});
        if(subscribed){res.status(200).json(new Apiresponse(200,subscribed,"Unsuscribed"))};
      
        const subscribe=await subscription.create({
            channel:mongoose.Types.ObjectId(channelId),
            subscriber:req.user._id
        })

        if(!subscribe){throw new ApiError(500,"Cannot subscribed")};
        res.status(200)
        .json(new Apiresponse(200,subscribe,"Subscribed"));

    } catch (error) {
        throw new ApiError(500,"Something went wrong while subscribing");
    } 

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){throw new ApiError(400,"Invalid  channelId")};
    if(!req.user){throw new ApiError(400,"user no logged in")};

    const subscriber=await subscription.find({channel:mongoose.Types.ObjectId(channelId)}).populate("subscriber","_id username email");
    if(!subscriber){
        throw new ApiError(500,"Something went wrong while fetchig subscriber");
    }

    res.status(200)
    .json(new Apiresponse(200,subscriber,"Subscriber fetched succeddfully"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){throw new ApiError(400,"Invalid  subscriberId")};
    if(!req.user){throw new ApiError(400,"user no logged in")};

    const subscribedto=await subscription.find({channel:mongoose.Types.ObjectId(subscriberId)}).populate("channel","_id username email");
    if(!subscribedto){
        throw new ApiError(500,"Something went wrong while fetchig subscribed channel");
    }

    res.status(200)
    .json(new Apiresponse(200,subscribedto,"subscribed channel fetched succeddfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}