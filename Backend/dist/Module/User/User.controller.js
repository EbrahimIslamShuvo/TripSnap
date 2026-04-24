"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_service_1 = require("./User.service");
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
exports.UserController = {
    register,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    updateProfile,
    changePassword
};
//# sourceMappingURL=User.controller.js.map