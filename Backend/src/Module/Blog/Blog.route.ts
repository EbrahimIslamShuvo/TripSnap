import express from "express";
import { blogController } from "./Blog.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { blogUpload } from "./Blog.upload";

const router = express.Router();

router.get("/all", blogController.getAllBlogs); 
router.patch("/toggle/:id", blogController.toggleBlogStatusController);
router.post("/create", authMiddleware, blogUpload, blogController.createBlog);
router.get("/my", authMiddleware, blogController.getMyBlogs); 
router.get("/:id", blogController.getSingleBlog);

export const BlogRoutes = router;