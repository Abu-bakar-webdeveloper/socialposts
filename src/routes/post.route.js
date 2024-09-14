import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/post").post(verifyJWT, upload.single("image"), createPost)

export default router;