import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, getPost, updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/post").post(verifyJWT, upload.single("image"), createPost)
router.route("/post/c/:postId").patch(verifyJWT, upload.single("image"), updatePost)
router.route("/post/b/:postId").get(getPost)

export default router;