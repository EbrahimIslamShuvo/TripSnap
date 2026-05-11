"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const Comment_service_1 = require("./Comment.service");
const createComment = async (req, res) => {
    try {
        const result = await Comment_service_1.CommentService.createComment(req.user.id, req.body, req.file);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// ================= PLACE COMMENTS =================
const getPlaceComments = async (req, res) => {
    try {
        const result = await Comment_service_1.CommentService.getPlaceComments(req.params.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// ================= BLOG COMMENTS =================
const getBlogComments = async (req, res) => {
    try {
        const result = await Comment_service_1.CommentService.getBlogComments(req.params.id);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const getMyComments = async (req, res) => {
    try {
        const result = await Comment_service_1.CommentService.getMyComments(req.params.userId);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// ================= DELETE COMMENT =================
const deleteComment = async (req, res) => {
    try {
        console.log(req.user);
        const result = await Comment_service_1.CommentService.deleteComment(req.params.id, req.user.id || req.user._id);
        res.json(result);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.CommentController = {
    createComment,
    getPlaceComments,
    getBlogComments,
    getMyComments,
    deleteComment,
};
//# sourceMappingURL=Comment.controller.js.map