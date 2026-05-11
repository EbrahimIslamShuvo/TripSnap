"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const Comment_model_1 = require("./Comment.model");
const createComment = async (userId, payload, file) => {
    const comment = await Comment_model_1.Comment.create({
        user: userId,
        place: payload.place,
        blog: payload.blog,
        text: payload.text,
        image: file?.path,
    });
    return comment;
};
// ================= GET PLACE COMMENTS =================
const getPlaceComments = async (placeId) => {
    return await Comment_model_1.Comment.find({
        place: placeId,
    })
        .populate("user")
        .sort({ createdAt: -1 });
};
// ================= GET BLOG COMMENTS =================
const getBlogComments = async (blogId) => {
    return await Comment_model_1.Comment.find({
        blog: blogId,
    })
        .populate("user")
        .sort({ createdAt: -1 });
};
const getMyComments = async (userId) => {
    const comments = await Comment_model_1.Comment.find({
        user: userId,
    })
        .populate("place")
        .populate("blog")
        .sort({ createdAt: -1 });
    return comments;
};
// ================= DELETE COMMENT =================
const deleteComment = async (commentId, userId) => {
    const comment = await Comment_model_1.Comment.findById(commentId);
    if (!comment) {
        throw new Error("Comment not found");
    }
    if (String(comment.user) !==
        String(userId)) {
        throw new Error("Unauthorized");
    }
    await Comment_model_1.Comment.findByIdAndDelete(commentId);
    return {
        success: true,
        message: "Comment deleted successfully",
    };
};
exports.CommentService = {
    createComment,
    getPlaceComments,
    getBlogComments,
    getMyComments,
    deleteComment,
};
//# sourceMappingURL=Comment.service.js.map