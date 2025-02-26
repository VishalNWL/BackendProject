import { Router } from "express";
import { registeruser } from "../controllers/user.controllers.js";
import {upload} from "../Middlewares/multer.middleware.js"

const userrouter=Router();

userrouter.route("/register").post(
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


export default userrouter;