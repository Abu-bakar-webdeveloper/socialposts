import express from 'express';
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';


const app = express();

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server started on port", process.env.PORT);
    })
})
.catch((err) => {
    console.log("Mongodb connection failed !!! ", err);
})


// routes declaration

app.use("/user", userRouter)
app.use("/api", postRouter)

export { app }