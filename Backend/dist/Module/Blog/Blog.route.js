"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Blog_controller_1 = require("./Blog.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const Blog_upload_1 = require("./Blog.upload");
const router = express_1.default.Router();
// ================= CREATE =================
router.post("/create", auth_middleware_1.authMiddleware, Blog_upload_1.blogUpload, Blog_controller_1.blogController.createBlog);
// ================= UPDATE =================
router.patch("/:id", auth_middleware_1.authMiddleware, Blog_upload_1.blogUpload, Blog_controller_1.blogController.updateBlog);
// ================= MY BLOG =================
router.get("/my", auth_middleware_1.authMiddleware, Blog_controller_1.blogController.getMyBlogs);
// ================= PUBLIC =================
router.get("/all", Blog_controller_1.blogController.getAllBlogs);
// ================= FILTER =================
router.get("/by-place/:placeId", Blog_controller_1.blogController.getBlogsByPlace);
router.post("/by-places", Blog_controller_1.blogController.getBlogsByPlaces);
// ================= AUTHOR (🔥 BEFORE :id) =================
router.get("/author/:id", Blog_controller_1.blogController.getBlogsByAuthor);
// ================= SINGLE BLOG (🔥 ALWAYS LAST) =================
router.get("/:id", Blog_controller_1.blogController.getSingleBlog);
// ================= TOGGLE =================
router.patch("/toggle/:id", Blog_controller_1.blogController.toggleBlogStatusController);
exports.BlogRoutes = router;
//# sourceMappingURL=Blog.route.js.map