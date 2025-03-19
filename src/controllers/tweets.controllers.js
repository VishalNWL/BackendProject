import mongoose,{isValidObjectId} from "mongoose"
import { Tweet } from "../Models/tweets.models.js"
import { User } from "../Models/user.model.js"
import {asyncHandler} from "../Utils/asyncHandler.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {ApiError} from "../Utils/Apierrors.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body;
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!content?.trim()){throw new ApiError(400,"Write something inside the content")}

    const tweet=await Tweet.create({
        content:content,
        owner:req.user._id
    })

    if(!tweet){throw new ApiError(500,"Cannot create user")};

    res.status(200)
    .json(new Apiresponse(200,tweet,"Tweet created successfully"));
    
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
     const {userId}=req.params;
    if(!userId){throw new ApiError(400,"UserId not found")};
    if(!req.user){throw new ApiError(400,"User not valid")};

    try {
        const usertweets=await Tweet.find(
            {
                owner:userId
            }
        )

        if(!usertweets){throw new ApiError(500,"No tweets found")};
        res.status(200)
        .json(new Apiresponse(200,usertweets,"Tweets fetched successfully"));

    } catch (error) {
        throw new ApiError(500,"Something happed while fetching tweets");
    }

    
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {newcontent}=req.body;
    if(!newcontent){throw new ApiError(400,"new content is empty")};
    if(!isValidObjectId(tweetId)){throw new ApiError(400,"Tweet id is not valid")};
    if(!req.user){throw new ApiError(400,"User not valid")};

    try {
        const updated=await Tweet.findOneAndUpdate({
            _id:mongoose.Types.ObjectId(tweetId),
            owner:req.user._id
        },
        {
            $set:{
                content:newcontent
            }
        },
        {
            new:true
        }
    )

        if(!updated){
            throw new ApiError(404,"Tweet not found");
        }
        res.status(200)
        .json(new Apiresponse(200,updated,"Tweet updated successfully"));

    } catch (error) {
        throw new ApiError(500,"Cannot delete tweet")
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
    if(!isValidObjectId(tweetId)){throw new ApiError(400,"Tweet id is not valid")};
    if(!req.user){throw new ApiError(400,"User not valid")};

    try {
        const deleted=await Tweet.findOneAndDelete({
            _id:mongoose.Types.ObjectId(tweetId),
            owner:req.user._id
        })

        if(!deleted){
            throw new ApiError(404,"Tweet not found");
        }
        res.status(200)
        .json(new Apiresponse(200,deleted,"Tweet deleted successfully"));

    } catch (error) {
        throw new ApiError(500,"Cannot delete tweet")
    }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
