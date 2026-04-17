"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_service_1 = require("./User.service");
const register = async (req, res) => {
    try {
        const image = req.file?.path;
        const result = await User_service_1.UserService.registerUser({
            ...req.body,
            image,
        });
        res.json({ success: true, data: result });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const verifyOTP = async (req, res) => {
    try {
        await User_service_1.UserService.verifyOTP(req.body.email, req.body.otp);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const login = async (req, res) => {
    try {
        const result = await User_service_1.UserService.loginUser(req.body);
        res.json({
            success: true,
            token: result.token,
            data: result.user,
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        await User_service_1.UserService.forgotPassword(req.body.email);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const resetPassword = async (req, res) => {
    try {
        await User_service_1.UserService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
        res.json({ success: true });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.UserController = {
    register,
    verifyOTP,
    login,
    forgotPassword,
    resetPassword,
};
//# sourceMappingURL=User.controller.js.map