"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = require("./User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils/jwt");
const otp_1 = require("../../utils/otp");
const sendEmail_1 = require("../../utils/sendEmail");
// 🔥 REGISTER + SEND OTP
const registerUser = async (payload) => {
    const existingUser = await User_model_1.User.findOne({ email: payload.email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const otp = (0, otp_1.generateOTP)();
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const user = await User_model_1.User.create({
        ...payload,
        password: hashedPassword,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
    });
    await (0, sendEmail_1.sendEmail)(user.email, otp);
    return user;
};
// 🔥 VERIFY OTP
const verifyOTP = async (email, otp) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (!user.otp || !user.otpExpires) {
        throw new Error("OTP not found");
    }
    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (user.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }
    user.isVerified = true;
    // ✅ delete instead of undefined
    delete user.otp;
    delete user.otpExpires;
    await user.save();
    return true;
};
// 🔥 LOGIN
const loginUser = async (payload) => {
    const user = await User_model_1.User.findOne({ email: payload.email });
    if (!user)
        throw new Error("User not found");
    if (!user.isVerified) {
        throw new Error("Please verify your email first");
    }
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.createToken)({
        id: user._id,
        role: user.role,
    });
    return {
        user,
        token,
    };
};
// 🔥 FORGOT PASSWORD (SEND OTP)
const forgotPassword = async (email) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const otp = (0, otp_1.generateOTP)();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await (0, sendEmail_1.sendEmail)(email, otp);
    return true;
};
// 🔥 RESET PASSWORD
const resetPassword = async (email, otp, newPassword) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (!user.otp || !user.otpExpires) {
        throw new Error("OTP not found");
    }
    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (user.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    // ✅ clean delete
    delete user.otp;
    delete user.otpExpires;
    await user.save();
    return true;
};
exports.UserService = {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
};
//# sourceMappingURL=User.service.js.map