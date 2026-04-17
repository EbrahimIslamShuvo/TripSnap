import express from "express";
import { UserController } from "./User.controller";
import { upload } from "../../config/multer";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

// 🔐 REGISTER
router.post("/register", upload.single("image"), UserController.register);

// 🔐 LOGIN
router.post("/login", UserController.login);

// 🔑 FORGOT PASSWORD
router.post("/forgot-password", UserController.forgotPassword);

// 🔢 VERIFY OTP
router.post("/verify-otp", UserController.verifyOTP);

// 🔄 RESET PASSWORD
router.post("/reset-password", UserController.resetPassword);

// 🔥 GET LOGGED IN USER
router.get("/me", authMiddleware, (req: any, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.put(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  UserController.updateProfile
);

router.post(
  "/change-password",
  authMiddleware,
  UserController.changePassword
);

export const UserRoutes = router;