import {Video} from "../Models/video.model.js"
import {asyncHandler} from "../Utils/asyncHandler.js"
import {ApiError} from "../Utils/Apierrors.js"
import {Apiresponse} from "../Utils/Apiresponse.js"
import {Playlist} from "../Models/playlists.model.js"
import mongoose, { isValidObjectId } from "mongoose"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!req.user._id){throw new ApiError(400,"User not logged in")};

  try {
      const playlist= await Playlist.create({
          name:name,
          description:description,
          owner:new mongoose.Types.ObjectId(req.user._id)
      })

      res.status(200)
      .json(new Apiresponse(200,playlist,"Playlist created successfully"));
  } catch (error) {
    throw new ApiError(500,"There is something error while creating playlist");
  }

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!req.user){throw new ApiError(400,"User not logged in")};
    
    try {
        const playlist= await Playlist.find({
            owner:req.user_id
        })
        
        if(!playlist){throw new ApiError(404,"No playlist found")};
        res.status(200)
        .json(new Apiresponse(200,playlist,"Playlist fetched successfully"));

    } catch (error) {
        throw new ApiError(new ApiError(400,"There is something error happened while fetching playlist"));
    }
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"PlaylistId is not valid")};
    
    try {
        const playlist= await Playlist.findById({
            _id:playlistId
        })
        
        if(!playlist){throw new ApiError(404,"No playlist found")};
        res.status(200)
        .json(new Apiresponse(200,playlist,"Playlist fetched successfully"));

    } catch (error) {
        throw new ApiError(new ApiError(400,"There is something error happened while fetching playlist"));
    }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"PlaylistId is not valid")};
    if(!isValidObjectId(videoId)){throw new ApiError(400,"videoId is not valid")};
    
    try {
        const playlist = await Playlist.findByIdAndUpdate({
            _id:playlistId
        },
        {
            $push:{videos:videoId}
        }
    )

        if(!playlist){throw new ApiError(404,"No playlist found")};
        res.status(200)
        .json(new Apiresponse(200,playlist,"Video added to Playlist successfully"));

    } catch (error) {
        throw new ApiError(new ApiError(400,"There is something error happened while adding to playlist"));
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"Invalid playlist id")};
    if(!isValidObjectId(videoId)){throw new ApiError(400,"Invalid video id")};

    try {
        const playlist= await Playlist.findByIdAndUpdate({
            _id:new mongoose.Types.ObjectId(playlistId)
        },
        {
            $pull:{videos:new mongoose.Types.ObjectId(videoId)}
        },{new:true})
        
        res.status(200)
        .json(new Apiresponse(200,playlist,"Video removed successfully"));
    } catch (error) {
        throw new ApiError(500,"There is something wrong happened while removing the video");
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"Invalid playlist id")};

    try {
        const playlist=await Playlist.findByIdAndDelete({_id:new mongoose.Types.isValidObjectId(playlistId)});
        if(!playlist){throw new ApiError(404,"No Playlist found")};

        res.status(200)
        .json(new Apiresponse(200,playlist,"Playlist deleted successfully"));
    } catch (error) {
        throw new ApiError(500,"There is something happened while deleting playlist");
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    
    if(!req.user){throw new ApiError(400,"User not logged in")};
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"Invalid playlist id")};
    if(!name||!description){throw new ApiError(400,"All fields are required")};
    try {
        const playlist=await findByIdAndUpdate(
            {_id:new mongoose.Types.ObjectId(playlistId)},
            {
                name:name,
                description:description
            },
            {
                new:true
            }      
    )
    if(!playlist){throw new ApiError(404,"No playlist found")};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while updating the playlist"+error);
    }

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}