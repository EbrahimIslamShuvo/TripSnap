"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const multer_1 = require("../../config/multer");
const Comment_controller_1 = require("./Comment.controller");
const router = express_1.default.Router();
// 🔥 CREATE
router.post("/create", auth_middleware_1.authMiddleware, multer_1.upload.single("image"), Comment_controller_1.CommentController.createComment);
// 🔥 PLACE COMMENTS
router.get("/place/:id", Comment_controller_1.CommentController.getPlaceComments);
// 🔥 BLOG COMMENTS
router.get("/blog/:id", Comment_controller_1.CommentController.getBlogComments);
router.get("/user/:userId", Comment_controller_1.CommentController.getMyComments);
router.delete("/:id", auth_middleware_1.authMiddleware, Comment_controller_1.CommentController.deleteComment);
exports.CommentRoutes = router;
//# sourceMappingURL=Comment.route.js.map