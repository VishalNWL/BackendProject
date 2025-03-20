import { asyncHandler } from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/Apierrors.js"
import { Apiresponse } from "../Utils/Apiresponse.js"
import { Router } from "express"
import {jwtverify} from "../Middlewares/auth.middleware.js"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controllers.js"

const router=new Router();
router.use(jwtverify);

router.route('/').post(createPlaylist);
router.route("/:userId").get(getUserPlaylists);

router.route("/:playlistId").get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route('/:playlistId/:videoId').post(addVideoToPlaylist)
  .delete(removeVideoFromPlaylist);

export default router;