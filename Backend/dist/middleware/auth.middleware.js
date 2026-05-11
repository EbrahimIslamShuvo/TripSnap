"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const User_model_1 = require("../Module/User/User.model");
// ================= AUTH MIDDLEWARE =================
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        // ================= TOKEN =================
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        // ================= VERIFY =================
        const decoded = (0, jwt_1.verifyToken)(token);
        // ================= USER =================
        const user = await User_model_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        // ================= SAVE USER =================
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map