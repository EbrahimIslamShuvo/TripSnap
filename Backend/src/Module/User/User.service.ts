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

  const otp = generateOTP();

  const user = await User.findOneAndUpdate(
    { email: payload.email },
    {
      ...payload,
      password: hashed,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      isVerified: false,
    },
    {
      upsert: true,
      new: true,
    }
  );

  await sendEmail(payload.email, otp);

  return user;
};

// ================= LOGIN =================
const loginUser = async (payload: any) => {

  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.isVerified) {
    throw new Error("Please verify OTP first");
  }

  const token = createToken({
    id: user._id,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (email: string) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();

  user.otp = otp;

  user.otpExpires = new Date(
    Date.now() + 5 * 60 * 1000
  );

  await user.save();

  await sendEmail(email, otp);
};

// ================= VERIFY OTP =================
const verifyOTP = async (
  email: string,
  otp: string
) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    !user.otpExpires ||
    user.otpExpires < new Date()
  ) {
    throw new Error("OTP expired");
  }

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

  if (!user) {
    throw new Error("User not found");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (
    !user.otpExpires ||
    user.otpExpires < new Date()
  ) {
    throw new Error("OTP expired");
  }

  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  // 🔥 CLEAR OTP
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save();
};

// ================= UPDATE PROFILE =================
const updateProfile = async (userId: string, payload: any, file?: any) => {

  const user = await User.findById(userId);

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
      facebook:
        payload.facebook ||
        user.social?.facebook,

      instagram:
        payload.instagram ||
        user.social?.instagram,

      twitter:
        payload.twitter ||
        user.social?.twitter,

      youtube:
        payload.youtube ||
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
const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(
    oldPassword,
    user.password
  );

  if (!isMatch) {
    throw new Error("Old password incorrect ❌");
  }

  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  await user.save();
};

// ================= GET ALL USERS =================
const getAllUsers = async () => {
  return await User.find().select("-password");
};

// ================= GET SINGLE USER =================
const getSingleUser = async (id: string) => {

  const user = await User.findById(id)

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
const savePlace = async (
  userId: string,
  placeId: string
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // 🔥 CHECK ALREADY SAVED
  const alreadySaved = user.savedPlaces.some(
    (id) => id.toString() === placeId
  );

  // 🔥 UNSAVE
  if (alreadySaved) {

    user.savedPlaces = user.savedPlaces.filter(
      (id) => id.toString() !== placeId
    );

    await user.save();

    return {
      saved: false,
      message: "Place removed from saved list",
    };
  }

  // 🔥 SAVE
  user.savedPlaces.push(placeId as any);

  await user.save();

  return {
    saved: true,
    message: "Place saved successfully",
  };
};

const saveBlog = async (
  userId: string,
  blogId: string
) => {

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // 🔥 ALREADY SAVED
  const alreadySaved = user.savedBlogs.some(
    (id) => id.toString() === blogId
  );

  // 🔥 UNSAVE
  if (alreadySaved) {

    user.savedBlogs = user.savedBlogs.filter(
      (id) => id.toString() !== blogId
    );

    await user.save();

    return {
      saved: false,
      message: "Blog removed from saved list",
    };
  }

  // 🔥 SAVE
  user.savedBlogs.push(blogId as any);

  await user.save();

  return {
    saved: true,
    message: "Blog saved successfully",
  };
};


const generatePassword = () => {
  return Math.random()
    .toString(36)
    .slice(-8);
};

const createTeamMember = async (
  payload: any,
  file?: any
) => {

  // 🔥 EMAIL EXISTS CHECK
  const existingUser =
    await User.findOne({
      email: payload.email,
    });

  if (existingUser) {
    throw new Error(
      "Account already exists with this email"
    );
  }

  // 🔥 RANDOM PASSWORD
  const plainPassword =
    generatePassword();

  // 🔥 HASH PASSWORD
  const hashedPassword =
    await bcrypt.hash(
      plainPassword,
      10
    );

  // 🔥 CREATE USER
  const user =
    await User.create({
      name: payload.name,
      email: payload.email,
      role: payload.role,
      image: file?.path,
      password: hashedPassword,

      isVerified: true,
    });

  // 🔥 SEND MAIL
  await sendEmail(
    payload.email,
    `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0;">Welcome to TripSnap ✈️</h1>
        <p style="margin-top: 10px; font-size: 15px;">
          Your account has been created successfully
        </p>
      </div>

      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">
          Hello,
        </p>

        <p style="font-size: 15px; line-height: 1.7;">
          We are excited to have you onboard. Below are your account details:
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>Role:</strong> ${payload.role}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> ${payload.email}</p>
          <p style="margin: 8px 0;"><strong>Password:</strong> ${plainPassword}</p>
        </div>

        <p style="font-size: 14px; color: #dc2626;">
           For security reasons, please login and change your password immediately.
        </p>

        <div style="text-align: center; margin-top: 30px;">
          <a 
            href="https://yourwebsite.com/login"
            style="
              background: #2563eb;
              color: white;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
            "
          >
            Login Now
          </a>
        </div>
      </div>

      <div style="background: #f3f4f6; text-align: center; padding: 20px; font-size: 13px; color: #6b7280;">
        © ${new Date().getFullYear()} TripSnap. All rights reserved.
      </div>
    </div>
  </div>
  `
  );

  return user;
};

// ================= EXPORT =================
export const UserService = {
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
  createTeamMember,
};