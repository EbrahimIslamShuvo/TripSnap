"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.toggleBlogStatusController = void 0;
const Blog_service_1 = require("./Blog.service");
const Activity_service_1 = require("../Activity/Activity.service");
const Blog_model_1 = require("./Blog.model");
const createBlog = async (req, res) => {
    try {
        const files = req.files;
        const banner = files?.banner?.[0]?.path;
        const gallery = files?.gallery?.map((f) => f.path) || [];
        const sectionImages = files?.sectionImages || [];
        // 🔥 PARSE SECTIONS
        let sections = JSON.parse(req.body.sections);
        let imgIndex = 0;
        // 🔥 MAP IMAGES
        sections = sections.map((sec) => {
            if (sec.type === "image") {
                sec.image = sectionImages[imgIndex]?.path || "";
                imgIndex++;
            }
            return sec;
        });
        // 🔥 PLACES
        let places = [];
        if (req.body.places) {
            places = JSON.parse(req.body.places);
        }
        //  CREATE BLOG
        const result = await Blog_service_1.BlogService.createBlog({
            title: req.body.title,
            banner,
            gallery,
            sections,
            places,
            createdBy: req.user.id,
            isActive: true,
        });
        // =========================
        // ADD ACTIVITY HERE
        // =========================
        await Activity_service_1.ActivityService.createActivity({
            user: req.user.id,
            type: "BLOG",
            message: `${req.user.name} created a blog`,
            blog: result._id,
        });
        // 🔥 RESPONSE
        res.json({
            success: true,
            message: "Blog created ✅",
            data: result,
        });
    }
    catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const getAllBlogs = async (req, res) => {
    const result = await Blog_service_1.BlogService.getAllBlogs();
    res.json({
        success: true,
        data: result,
    });
};
const getSingleBlog = async (req, res) => {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
        return res.status(400).json({
            success: false,
            message: "Invalid ID",
        });
    }
    const result = await Blog_service_1.BlogService.getSingleBlog(id);
    res.json({
        success: true,
        data: result,
    });
};
const getMyBlogs = async (req, res) => {
    const result = await Blog_service_1.BlogService.getMyBlogs(req.user.id);
    res.json({
        success: true,
        data: result,
    });
};
const toggleBlogStatusController = async (req, res) => {
    try {
        const result = await Blog_service_1.BlogService.toggleBlogStatus(req.params.id);
        res.json({
            success: true,
            message: "Status updated",
            data: result,
        });
    }
    catch (er) {
        res.status(400).json({
            success: false,
            message: er instanceof Error ? er.message : "Error toggling status",
        });
    }
};
exports.toggleBlogStatusController = toggleBlogStatusController;
// 🔹 GET /by-place/:placeId (SinglePlace page)
const getBlogsByPlace = async (req, res) => {
    try {
        const { placeId } = req.params;
        // 🔥 TYPE SAFETY CHECK
        if (!placeId || typeof placeId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid placeId",
            });
        }
        const result = await Blog_service_1.BlogService.getBlogsByPlaceFromDB(placeId);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
        });
    }
};
// 🔹 POST /by-places (SingleBlog page)
const getBlogsByPlaces = async (req, res) => {
    try {
        const { placeIds } = req.body;
        if (!placeIds || placeIds.length === 0) {
            return res.json({ success: true, data: [] });
        }
        const result = await Blog_service_1.BlogService.getBlogsByPlacesFromDB(placeIds);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch related blogs",
        });
    }
};
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog_model_1.Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        const files = req.files;
        // =========================
        // 🔥 BANNER (KEEP OLD)
        // =========================
        const banner = files?.banner?.[0]?.path || blog.banner;
        // =========================
        // 🔥 GALLERY (KEEP OLD)
        // =========================
        let gallery = blog.gallery;
        if (files?.gallery) {
            gallery = files.gallery.map((f) => f.path);
        }
        // =========================
        // 🔥 SECTIONS
        // =========================
        let sections = JSON.parse(req.body.sections || "[]");
        const sectionImages = files?.sectionImages || [];
        let imgIndex = 0;
        sections = sections.map((sec, index) => {
            if (sec.type === "image") {
                // ✅ NEW IMAGE
                if (sectionImages[imgIndex]) {
                    sec.image = sectionImages[imgIndex].path;
                    imgIndex++;
                }
                else {
                    // ✅ KEEP OLD IMAGE
                    sec.image = blog.sections[index]?.image || "";
                }
            }
            // 🔥 TABLE SAFE
            if (sec.type === "table" && !sec.table) {
                sec.table = { title: "", columns: [], rows: [] };
            }
            return sec;
        });
        // =========================
        // 🔥 PLACES
        // =========================
        let places = blog.places;
        if (req.body.places) {
            places = JSON.parse(req.body.places);
        }
        // =========================
        // 🔥 UPDATE
        // =========================
        const result = await Blog_service_1.BlogService.updateBlog(req.params.id, {
            title: req.body.title,
            banner,
            gallery,
            sections,
            places,
        });
        res.json({
            success: true,
            message: "Blog updated successfully ✅",
            data: result,
        });
    }
    catch (err) {
        console.log("UPDATE ERROR:", err);
        res.status(400).json({
            success: false,
            message: err.message || "Update failed",
        });
    }
};
const getBlogsByAuthor = async (req, res) => {
    try {
        const rawId = req.params.id;
        // 🔥 SAFE CHECK
        if (!rawId || Array.isArray(rawId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",
            });
        }
        const id = rawId;
        // 🔥 SERVICE CALL (INSIDE TRY)
        const blogs = await Blog_service_1.BlogService.getBlogsByAuthorService(id);
        return res.json({
            success: true,
            data: blogs,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.blogController = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    getMyBlogs,
    toggleBlogStatusController: exports.toggleBlogStatusController,
    getBlogsByPlaces,
    getBlogsByPlace,
    updateBlog,
    getBlogsByAuthor
};
//# sourceMappingURL=Blog.controller.js.map