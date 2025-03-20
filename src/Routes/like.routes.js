import { Router } from "express";
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controllers.js"

import { jwtverify } from "../Middlewares/auth.middleware.js";

const router =Router();
router.use(jwtverify);

router.route('/video/:videoId').post(toggleVideoLike);
router.route('/comment/:commentId').post(toggleCommentLike);
router.route('/tweet/:tweetId').post(toggleTweetLike);

router.route('/video/').get(getLikedVideos);

export default router;