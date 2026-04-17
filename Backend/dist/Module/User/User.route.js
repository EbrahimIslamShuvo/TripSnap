"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const multer_1 = require("../../config/multer");
const router = express_1.default.Router();
router.post("/register", multer_1.upload.single("image"), User_controller_1.UserController.register);
router.post("/verify-otp", User_controller_1.UserController.verifyOTP);
router.post("/login", User_controller_1.UserController.login);
router.post("/forgot-password", User_controller_1.UserController.forgotPassword);
router.post("/reset-password", User_controller_1.UserController.resetPassword);
exports.UserRoutes = router;
//# sourceMappingURL=User.route.js.map