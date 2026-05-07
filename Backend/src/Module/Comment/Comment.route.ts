import express from "express";

import { authMiddleware } from "../../middleware/auth.middleware";

import { upload } from "../../config/multer";

import { CommentController } from "./Comment.controller";

const router = express.Router();

// 🔥 CREATE
router.post(
  "/create",
  authMiddleware,
  upload.single("image"),
  CommentController.createComment
);

// 🔥 PLACE COMMENTS
router.get(
  "/place/:id",
  CommentController.getPlaceComments
);

// 🔥 BLOG COMMENTS
router.get(
  "/blog/:id",
  CommentController.getBlogComments
);

router.get(
  "/user/:userId",
  CommentController.getMyComments
);

router.delete(
  "/:id",
  authMiddleware,
  CommentController.deleteComment
);

export const CommentRoutes = router;