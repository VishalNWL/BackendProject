import { Router } from "express";
import { loginUser, logoutUser, registeruser } from "../controllers/user.controllers.js";
import {upload} from "../Middlewares/multer.middleware.js"
import { jwtverify } from "../Middlewares/auth.middleware.js";

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


export default router;