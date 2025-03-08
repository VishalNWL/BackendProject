import { Router } from "express";
import { loginUser, logoutUser, registeruser,refreshAccesstoken, changePassword, getCurrentUser, updateAccountdetail, updateAvatar, updateCoverimg, getUserChannelProfile, getUserWatchHistory } from "../controllers/user.controllers.js";
import {upload} from "../Middlewares/multer.middleware.js"
import { jwtverify } from "../Middlewares/auth.middleware.js";
import { isRunnableFunctionWithParse } from "openai/lib/RunnableFunction.mjs";

const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    ,registeruser);

//Login user
router.route("/login").post(loginUser);

//secured route for logout

router.route("/logout").post(jwtverify,logoutUser);

//for refreshing accesstoken
router.route("/refresh-Token").post(refreshAccesstoken);
router.route("/change-password").post(jwtverify,changePassword);
router.route("/current-user").get(jwtverify,getCurrentUser);
router.route("/update-user").patch(jwtverify,updateAccountdetail);
router.route("/avatar-update").patch(jwtverify,upload.single("/avatar"),updateAvatar);
router.route("/coverImage-update").patch(jwtverify,upload.single("/converImage"),updateCoverimg);
router.route("/c/:username").get(jwtverify,getUserChannelProfile);
router.route("/watchHistory").get(jwtverify,getUserWatchHistory);


export default router;