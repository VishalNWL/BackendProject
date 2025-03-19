import { createTweet,getUserTweets,updateTweet,deleteTweet } from "../controllers/tweets.controllers.js";
import { Router } from "express";

import { jwtverify } from "../Middlewares/auth.middleware.js";
const router=Router();

router.use(jwtverify);

router.route("/").post(createTweet);
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;