"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_model_1 = require("./User.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("../../utils/sendEmail");
const jwt_1 = require("../../utils/jwt");
// 🔥 GENERATE OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
// ================= REGISTER =================
const registerUser = async (payload) => {
    const exist = await User_model_1.User.findOne({ email: payload.email });
    if (exist && exist.isVerified) {
        throw new Error("User already exists");
    }
    const hashed = await bcrypt_1.default.hash(payload.password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const user = await User_model_1.User.findOneAndUpdate({ email: payload.email }, {
        ...payload,
        password: hashed,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
    }, { upsert: true, new: true });
    await (0, sendEmail_1.sendEmail)(payload.email, otp);
    return user;
};
// ================= LOGIN =================
const loginUser = async (payload) => {
    console.log("🔐 LOGIN START");
    const user = await User_model_1.User.findOne({ email: payload.email });
    //console.log("👤 USER:", user);
    if (!user) {
        throw new Error("User not found");
    }
    //console.log("🔑 INPUT PASSWORD:", payload.password);
    //console.log("🔑 DB PASSWORD:", user.password);
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    console.log("✅ MATCH:", isMatch);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    if (!user.isVerified) {
        throw new Error("Please verify OTP first");
    }
    //console.log("🚀 BEFORE TOKEN");
    const token = (0, jwt_1.createToken)({
        id: user._id,
        role: user.role,
    });
    //console.log("🎉 TOKEN:", token);
    return {
        user,
        token,
    };
};
// ================= FORGOT PASSWORD =================
const forgotPassword = async (email) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await (0, sendEmail_1.sendEmail)(email, otp);
};
// ================= VERIFY OTP =================
const verifyOTP = async (email, otp) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (user.otp !== otp)
        throw new Error("Invalid OTP");
    if (!user.otpExpires || user.otpExpires < new Date())
        throw new Error("OTP expired");
    user.isVerified = true;
    await user.save();
};
// ================= RESET PASSWORD =================
const resetPassword = async (email, otp, newPassword) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (user.otp !== otp)
        throw new Error("Invalid OTP");
    if (!user.otpExpires || user.otpExpires < new Date())
        throw new Error("OTP expired");
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    // 🔥 ekhane clear korba
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
};
const updateProfile = async (userId, payload, file) => {
    const user = await User_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    if (payload.name)
        user.name = payload.name;
    if (payload.email)
        user.email = payload.email;
    // CREATOR ONLY
    if (user.role === "traveler") {
        user.bio = payload.bio || user.bio;
        user.social = {
            facebook: payload.facebook || user.social?.facebook,
            instagram: payload.instagram || user.social?.instagram,
            twitter: payload.twitter || user.social?.twitter,
            youtube: payload.youtube || user.social?.youtube,
        };
    }
    if (file) {
        user.image = file.path;
    }
    await user.save();
    return user;
};
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User_model_1.User.findById(userId);
    if (!user)
        throw new Error("User not found");
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password incorrect ❌");
    }
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    await user.save();
};
exports.UserService = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    updateProfile,
    changePassword
};
//# sourceMappingURL=User.service.js.map