import { Request, Response } from "express";
import { UserService } from "./User.service";
import mongoose from "mongoose";

// REGISTER
const register = async (req: any, res: Response) => {
  try {
    const image = req.file?.path;

    const result = await UserService.registerUser({
      ...req.body,
      image,
    });

    res.json({
      success: true,
      message: "OTP sent",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// LOGIN (NO OTP)
const login = async (req: Request, res: Response) => {
  try {
    const result = await UserService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req: Request, res: Response) => {
  try {
    await UserService.forgotPassword(req.body.email);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// VERIFY OTP
const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    await UserService.verifyOTP(email, otp);

    res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// RESET PASSWORD
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    await UserService.resetPassword(email, otp, newPassword);

    res.json({
      success: true,
      message: "Password updated",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const result = await UserService.updateProfile(
      userId,
      req.body,
      req.file
    );

    res.json({
      success: true,
      message: "Profile updated",
      user: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    await UserService.changePassword(
      userId,
      oldPassword,
      newPassword
    );

    res.json({
      success: true,
      message: "Password changed",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllUsers = async (req: any, res: Response) => {
  try {
    // ADMIN CHECK
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized ❌",
      });
    }

    const users = await UserService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });

  } catch (err: any) {
    console.log("GET USERS ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // 🔥 ID VALIDATION
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 🔥 ObjectId CHECK (VERY IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const user = await UserService.getSingleUser(id);

    res.json({
      success: true,
      data: user,
    });

  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message || "User not found",
    });
  }
};

const savePlace = async (req: any,res: Response) => {
  try {

    const userId = req.user.id;
    const placeId = req.params.id;

    const result = await UserService.savePlace(
      userId,
      placeId
    );

    res.json({
      success: true,
      ...result,
    });

  } catch (err: any) {

    res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

const saveBlog = async (
  req: any,
  res: Response
) => {

  try {

    const userId = req.user.id;
    const blogId = req.params.id;

    const result =
      await UserService.saveBlog(
        userId,
        blogId
      );

    res.json({
      success: true,
      ...result,
    });

  } catch (err: any) {

    res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

export const UserController = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateProfile,
  changePassword,
  getAllUsers,
  getSingleUser,
  savePlace,
  saveBlog
};