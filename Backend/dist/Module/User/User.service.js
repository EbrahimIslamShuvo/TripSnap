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
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};
// ================= REGISTER =================
const registerUser = async (payload) => {
    const exist = await User_model_1.User.findOne({ email: payload.email });
    if (exist && exist.isVerified) {
        throw new Error("User already exists");
    }
    const hashed = await bcrypt_1.default.hash(payload.password, 10);
    const otp = generateOTP();
    const user = await User_model_1.User.findOneAndUpdate({ email: payload.email }, {
        ...payload,
        password: hashed,
        otp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
        isVerified: false,
    }, {
        upsert: true,
        new: true,
    });
    await (0, sendEmail_1.sendEmail)(payload.email, otp);
    return user;
};
// ================= LOGIN =================
const loginUser = async (payload) => {
    const user = await User_model_1.User.findOne({
        email: payload.email,
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    if (!user.isVerified) {
        throw new Error("Please verify OTP first");
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
// ================= FORGOT PASSWORD =================
const forgotPassword = async (email) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    await (0, sendEmail_1.sendEmail)(email, otp);
};
// ================= VERIFY OTP =================
const verifyOTP = async (email, otp) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (!user.otpExpires ||
        user.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }
    user.isVerified = true;
    await user.save();
};
// ================= RESET PASSWORD =================
const resetPassword = async (email, otp, newPassword) => {
    const user = await User_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }
    if (!user.otpExpires ||
        user.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    // 🔥 CLEAR OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
};
// ================= UPDATE PROFILE =================
const updateProfile = async (userId, payload, file) => {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (payload.name) {
        user.name = payload.name;
    }
    if (payload.email) {
        user.email = payload.email;
    }
    // 🔥 CREATOR ONLY
    if (user.role === "traveler") {
        user.bio = payload.bio || user.bio;
        user.social = {
            facebook: payload.facebook ||
                user.social?.facebook,
            instagram: payload.instagram ||
                user.social?.instagram,
            twitter: payload.twitter ||
                user.social?.twitter,
            youtube: payload.youtube ||
                user.social?.youtube,
        };
    }
    if (file) {
        user.image = file.path;
    }
    await user.save();
    return user;
};
// ================= CHANGE PASSWORD =================
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt_1.default.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Old password incorrect ❌");
    }
    user.password = await bcrypt_1.default.hash(newPassword, 10);
    await user.save();
};
// ================= GET ALL USERS =================
const getAllUsers = async () => {
    return await User_model_1.User.find().select("-password");
};
// ================= GET SINGLE USER =================
const getSingleUser = async (id) => {
    const user = await User_model_1.User.findById(id)
        .populate({
        path: "savedPlaces",
        match: {
            isActive: true,
        },
    })
        .populate({
        path: "savedBlogs",
        match: {
            isActive: true,
        },
    })
        .select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};
// ================= SAVE / UNSAVE PLACE =================
const savePlace = async (userId, placeId) => {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    // 🔥 CHECK ALREADY SAVED
    const alreadySaved = user.savedPlaces.some((id) => id.toString() === placeId);
    // 🔥 UNSAVE
    if (alreadySaved) {
        user.savedPlaces = user.savedPlaces.filter((id) => id.toString() !== placeId);
        await user.save();
        return {
            saved: false,
            message: "Place removed from saved list",
        };
    }
    // 🔥 SAVE
    user.savedPlaces.push(placeId);
    await user.save();
    return {
        saved: true,
        message: "Place saved successfully",
    };
};
const saveBlog = async (userId, blogId) => {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    // 🔥 ALREADY SAVED
    const alreadySaved = user.savedBlogs.some((id) => id.toString() === blogId);
    // 🔥 UNSAVE
    if (alreadySaved) {
        user.savedBlogs = user.savedBlogs.filter((id) => id.toString() !== blogId);
        await user.save();
        return {
            saved: false,
            message: "Blog removed from saved list",
        };
    }
    // 🔥 SAVE
    user.savedBlogs.push(blogId);
    await user.save();
    return {
        saved: true,
        message: "Blog saved successfully",
    };
};
const createTravelerOrAgent = async (payload) => {
    const exist = await User_model_1.User.findOne({
        email: payload.email,
    });
    if (exist) {
        throw new Error("User already exists");
    }
    // 🔥 RANDOM PASSWORD
    const plainPassword = generatePassword();
    const hashed = await bcrypt_1.default.hash(plainPassword, 10);
    // 🔥 CREATE USER
    const user = await User_model_1.User.create({
        name: payload.name,
        email: payload.email,
        role: payload.role, // traveler / agent
        password: hashed,
        isVerified: true, // AUTO VERIFIED
    });
    // 🔥 SEND MAIL
    await (0, sendEmail_1.sendEmail)(payload.email, `
Your account has been created successfully.

Role: ${payload.role}

Email: ${payload.email}

Password: ${plainPassword}

Please login and change your password.
`);
    return user;
};
// ================= EXPORT =================
exports.UserService = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    updateProfile,
    changePassword,
    getAllUsers,
    getSingleUser,
    savePlace,
    saveBlog,
    createTravelerOrAgent,
};
//# sourceMappingURL=User.service.js.map