import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../Models/comment.model.js"
import {ApiError} from "../Utils/Apierrors.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {asyncHandler} from "../Utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query;
    if(!isValidObjectId(videoId)){throw new ApiError(400,"Invalid videoId")};
    const comments=await Comment.find({video:videoId})
                   .populate("owner","username avatar")
                   .populate("video","title thumbnail")
                   .skip((parseInt(page)-1)*parseInt(limit))
                   .limit(parseInt(limit));

    if(!comments){throw new ApiError(400,"No comments found in this video")};
     
    res.status(200)
    .json(new Apiresponse(200,comments,`comment on page ${page} fetched successfully`));
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const {content}=req.body;
    
    if(!isValidObjectId(videoId) || !videoId){throw new ApiError(400,"Video is invalid")};
    
    if(!content){throw new ApiError(400,"Write something inside the comment")};
    if(!req.user){
        throw new ApiError(400,"User not logged in");
    }
  
        const comment=await Comment.create({
            content:content,
            video:new mongoose.Types.ObjectId(videoId),
            owner:new mongoose.Types.ObjectId(req.user._id)
        });
    
    res.status(200)
    .json(new Apiresponse(200,comment,"Comment added successfully"));

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params;
    const {newcomment}=req.body;

    if(!isValidObjectId(commentId)||!commentId){
        throw new ApiError(400,"VideoId required");
    }
    if(!newcomment){throw new ApiError(400,"No comment found")};
      
    if(!req.user){
        throw new ApiError(400,"User not logged in");
    }

      const updatedcomment=await Comment.findByIdAndUpdate(
          {
            _id:commentId,
            owner:req.user._id
          },
          {
              $set:{
                  content:newcomment
              }
          },
          {
              new:true
          }
      ).catch((err)=>{throw new ApiError(500,"Some error occured while searching in database")});

    if(updatedcomment===null){
        res.status(404)
        .json(new Apiresponse(404,null,"No comment found with this id"));
    }

  res.status(200)
  .json(new Apiresponse(200,updatedcomment,"comment updated successfully"));
    
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
   const {commentId}=req.params;
   if(!isValidObjectId(commentId)){throw new ApiError(400,"commentid is not valid")};
   if(!req.user){throw new ApiError(400,"User not logged in")};

   try {
    const deletedcomment= await Comment.findOneAndDelete({_id:commentId,owner:req.user._id});
    if(!deletedcomment){
        res.status(404)
        .json(new Apiresponse(404,null,"No comment found with this id"));
    }
    
   } catch (error) {
     throw new ApiError(500,"There is some problem while deleting the comment"+error);
   }
    
   res.status(200)
   .json(new Apiresponse(200,{commentId},"Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
