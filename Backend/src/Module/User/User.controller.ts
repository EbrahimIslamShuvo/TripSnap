import { Request, Response } from "express";
import { UserService } from "./User.service";

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

export const UserController = {
  register,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  updateProfile,
  changePassword
};