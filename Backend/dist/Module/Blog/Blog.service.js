"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const mongoose_1 = require("mongoose");
const Blog_model_1 = require("./Blog.model");
const createBlog = async (payload) => {
    return await Blog_model_1.Blog.create(payload);
};
const getAllBlogs = async () => {
    return await Blog_model_1.Blog.find()
        .populate("createdBy", "name role")
        .populate("places", "title thumbnailCard");
};
const getSingleBlog = async (id) => {
    return await Blog_model_1.Blog.findById(id)
        .populate("createdBy", "name")
        .populate("places", "title thumbnailCard location");
};
const getMyBlogs = async (userId) => {
    return await Blog_model_1.Blog.find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .populate("places", "title thumbnailCard");
};
const toggleBlogStatus = async (id) => {
    const blog = await Blog_model_1.Blog.findById(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    blog.isActive = !blog.isActive;
    await blog.save();
    return blog;
};
// 🔹 SINGLE PLACE (for SinglePlace page)
const getBlogsByPlaceFromDB = async (placeId) => {
    return await Blog_model_1.Blog.find({
        places: { $in: [placeId] },
    })
        .populate("createdBy", "name")
        .select("title banner createdAt createdBy")
        .sort({ createdAt: -1 });
};
// 🔹 MULTIPLE PLACES (for SingleBlog related)
const getBlogsByPlacesFromDB = async (placeIds) => {
    return await Blog_model_1.Blog.find({
        places: {
            $in: placeIds.map((id) => new mongoose_1.Types.ObjectId(id)),
        },
    })
        .populate("createdBy", "name")
        .select("title banner createdAt createdBy places")
        .sort({ createdAt: -1 });
};
const updateBlog = async (id, payload) => {
    const blog = await Blog_model_1.Blog.findById(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    // ✅ KEEP OLD IF NOT PROVIDED
    blog.title = payload.title || blog.title;
    blog.banner = payload.banner || blog.banner;
    blog.gallery = payload.gallery || blog.gallery;
    blog.sections = payload.sections || blog.sections;
    blog.places = payload.places || blog.places;
    await blog.save();
    return blog;
};
const getBlogsByAuthorService = async (authorId) => {
    return await Blog_model_1.Blog.find({ createdBy: authorId })
        .populate("createdBy", "name email image")
        .populate("places");
};
exports.BlogService = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    getMyBlogs,
    toggleBlogStatus,
    getBlogsByPlaceFromDB,
    getBlogsByPlacesFromDB,
    updateBlog,
    getBlogsByAuthorService
};
//# sourceMappingURL=Blog.service.js.map