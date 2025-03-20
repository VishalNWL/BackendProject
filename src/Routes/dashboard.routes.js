import  {getChannelStats,getChannelVideos} from "../controllers/dashboard.controllers.js"
import { asyncHandler } from "../Utils/asyncHandler.js"
import { ApiError } from "../Utils/Apierrors.js"
import { Apiresponse } from "../Utils/Apiresponse.js"
import { Router } from "express"
import {jwtverify} from "../Middlewares/auth.middleware.js"

const router=new Router();
router.use(jwtverify);

router.route("/:userId").get(getChannelStats);
router.route("/videos/:userId").get(getChannelVideos);

export default router;