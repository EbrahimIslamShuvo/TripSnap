import { User } from "./User.model";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail";
import { createToken } from "../../utils/jwt";

// 🔥 GENERATE OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// ================= REGISTER =================
const registerUser = async (payload: any) => {
  const exist = await User.findOne({ email: payload.email });

  if (exist && exist.isVerified) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(payload.password, 10);

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      ...payload,
      password: hashed,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    },
    { upsert: true, new: true }
  );

  await sendEmail(payload.email, otp);

  return user;
};

// ================= LOGIN =================
const loginUser = async (payload: any) => {
  console.log("🔐 LOGIN START");

  const user = await User.findOne({ email: payload.email });
  //console.log("👤 USER:", user);

  if (!user) {
    throw new Error("User not found");
  }

  //console.log("🔑 INPUT PASSWORD:", payload.password);
  //console.log("🔑 DB PASSWORD:", user.password);

  const isMatch = await bcrypt.compare(
    payload.password,
    user.password
  );

  console.log("✅ MATCH:", isMatch);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new Error("Please verify OTP first");
  }

  //console.log("🚀 BEFORE TOKEN");

  const token = createToken({
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
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendEmail(email, otp);
};

// ================= VERIFY OTP =================
const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  if (!user.otpExpires || user.otpExpires < new Date())
    throw new Error("OTP expired");

  user.isVerified = true;

  await user.save();
};
// ================= RESET PASSWORD =================
const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  if (user.otp !== otp) throw new Error("Invalid OTP");

  if (!user.otpExpires || user.otpExpires < new Date())
    throw new Error("OTP expired");

  user.password = await bcrypt.hash(newPassword, 10);

  // 🔥 ekhane clear korba
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();
};

const updateProfile = async (userId: string, payload: any, file?: any) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  if (payload.name) user.name = payload.name;
  if (payload.email) user.email = payload.email;

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

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new Error("Old password incorrect ❌");
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
};

export const UserService = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateProfile,
  changePassword
};