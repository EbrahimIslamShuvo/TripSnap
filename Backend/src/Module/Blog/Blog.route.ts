import express from "express";
import { blogController } from "./Blog.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { blogUpload } from "./Blog.upload";

const router = express.Router();

// ================= CREATE =================
router.post(
  "/create",
  authMiddleware,
  blogUpload,
  blogController.createBlog
);

// ================= UPDATE =================
router.patch(
  "/:id",
  authMiddleware,
  blogUpload,
  blogController.updateBlog
);

// ================= MY BLOG =================
router.get(
  "/my",
  authMiddleware,
  blogController.getMyBlogs
);

// ================= PUBLIC =================
router.get("/all", blogController.getAllBlogs);

// ================= FILTER =================
router.get("/by-place/:placeId", blogController.getBlogsByPlace);
router.post("/by-places", blogController.getBlogsByPlaces);

// ================= AUTHOR (🔥 BEFORE :id) =================
router.get("/author/:id", blogController.getBlogsByAuthor);

// ================= SINGLE BLOG (🔥 ALWAYS LAST) =================
router.get("/:id", blogController.getSingleBlog);

// ================= TOGGLE =================
router.patch(
  "/toggle/:id",
  blogController.toggleBlogStatusController
);

export const BlogRoutes = router;