"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.getSingleUser = void 0;
const User_service_1 = require("./User.service");
const mongoose_1 = __importDefault(require("mongoose"));
// REGISTER
const register = async (req, res) => {
    try {
        const image = req.file?.path;
        const result = await User_service_1.UserService.registerUser({
            ...req.body,
            image,
        });
        res.json({
            success: true,
            message: "OTP sent",
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
// LOGIN (NO OTP)
const login = async (req, res) => {
    try {
        const result = await User_service_1.UserService.loginUser(req.body);
        res.json({
            success: true,
            message: "Login successful",
            token: result.token,
            user: result.user,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        await User_service_1.UserService.forgotPassword(req.body.email);
        res.json({
            success: true,
            message: "OTP sent to email",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await User_service_1.UserService.verifyOTP(email, otp);
        res.json({
            success: true,
            message: "OTP verified",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        await User_service_1.UserService.resetPassword(email, otp, newPassword);
        res.json({
            success: true,
            message: "Password updated",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await User_service_1.UserService.updateProfile(userId, req.body, req.file);
        res.json({
            success: true,
            message: "Profile updated",
            user: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        await User_service_1.UserService.changePassword(userId, oldPassword, newPassword);
        res.json({
            success: true,
            message: "Password changed",
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        // ADMIN CHECK
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized ❌",
            });
        }
        const users = await User_service_1.UserService.getAllUsers();
        res.json({
            success: true,
            data: users,
        });
    }
    catch (err) {
        console.log("GET USERS ERROR:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Server error",
        });
    }
};
const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;
        // 🔥 ID VALIDATION
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        // 🔥 ObjectId CHECK (VERY IMPORTANT)
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID",
            });
        }
        const user = await User_service_1.UserService.getSingleUser(id);
        res.json({
            success: true,
            data: user,
        });
    }
    catch (err) {
        res.status(404).json({
            success: false,
            message: err.message || "User not found",
        });
    }
};
exports.getSingleUser = getSingleUser;
const savePlace = async (req, res) => {
    try {
        const userId = req.user.id;
        const placeId = req.params.id;
        const result = await User_service_1.UserService.savePlace(userId, placeId);
        res.json({
            success: true,
            ...result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const saveBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;
        const result = await User_service_1.UserService.saveBlog(userId, blogId);
        res.json({
            success: true,
            ...result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
const createTravelerOrAgent = async (req, res) => {
    try {
        // 🔥 ADMIN CHECK
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const result = await User_service_1.UserService.createTravelerOrAgent(req.body);
        res.json({
            success: true,
            message: "Account created & credentials sent to email",
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
exports.UserController = {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    updateProfile,
    changePassword,
    getAllUsers,
    getSingleUser: exports.getSingleUser,
    savePlace,
    saveBlog,
    createTravelerOrAgent
};
//# sourceMappingURL=User.controller.js.map