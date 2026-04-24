"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const multer_1 = require("../../config/multer");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// 🔐 REGISTER
router.post("/register", multer_1.upload.single("image"), User_controller_1.UserController.register);
// 🔐 LOGIN
router.post("/login", User_controller_1.UserController.login);
// 🔑 FORGOT PASSWORD
router.post("/forgot-password", User_controller_1.UserController.forgotPassword);
// 🔢 VERIFY OTP
router.post("/verify-otp", User_controller_1.UserController.verifyOTP);
// 🔄 RESET PASSWORD
router.post("/reset-password", User_controller_1.UserController.resetPassword);
// 🔥 GET LOGGED IN USER
router.get("/me", auth_middleware_1.authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});
router.put("/update-profile", auth_middleware_1.authMiddleware, multer_1.upload.single("image"), User_controller_1.UserController.updateProfile);
router.post("/change-password", auth_middleware_1.authMiddleware, User_controller_1.UserController.changePassword);
exports.UserRoutes = router;
//# sourceMappingURL=User.route.js.map