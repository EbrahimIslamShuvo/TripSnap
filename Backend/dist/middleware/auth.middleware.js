"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const User_model_1 = require("../Module/User/User.model");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        // 🔥 Bearer token split
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        const decoded = (0, jwt_1.verifyToken)(token);
        const user = await User_model_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        req.user = user;
        console.log("TOKEN RECEIVED:", token);
        next();
    }
    catch (error) {
        console.log("AUTH ERROR:", error); // 🔍 debug
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map