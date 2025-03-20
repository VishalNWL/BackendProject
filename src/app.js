import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static("Public"));

app.use(cookieParser())

//Importing router


//routes import
import userRouter from './Routes/user.routes.js'
import healthcheckRouter from "./Routes/healthckeck.routes.js"
import tweetRouter from "./Routes/tweets.routes.js"
import subscriptionRouter from "./Routes/subscription.routes.js"
import videoRouter from "./Routes/video.routes.js"
import commentRouter from "./Routes/comments.routes.js"
import likeRouter from "./Routes/like.routes.js"
import playlistRouter from "./Routes/playlist.routes.js"
import dashboardRouter from "./Routes/dashboard.routes.js"



//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


app.get("/",(req,res)=>{
    res.status(200).send("Everything is working");
})

export {app};