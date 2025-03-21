    import { ApiError } from "../Utils/Apierrors.js";
    import { asyncHandler } from "../Utils/asyncHandler.js";
    import jwt from "jsonwebtoken" 
    import { User } from "../Models/user.model.js";
    
    export const jwtverify = asyncHandler(async(req, _, next) => { 
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            
            // console.log(token);
            if (!token) {
                throw new ApiError(401, "Unauthorized request")
            }
        
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
            if (!user) {
                
                throw new ApiError(401, "Invalid Access Token")
            }
        
            req.user = user;
            next()
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid access token")
        }
        
    })