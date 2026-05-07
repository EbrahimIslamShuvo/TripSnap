import {
  Request,
  Response,
  NextFunction,
} from "express";

import { verifyToken } from "../utils/jwt";

import { User } from "../Module/User/User.model";

// ================= CUSTOM REQUEST =================
export interface AuthRequest
  extends Request {
  user?: any;
}

// ================= AUTH MIDDLEWARE =================
export const authMiddleware =
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({
          message:
            "Unauthorized",
        });
      }

      // ================= TOKEN =================
      const token =
        authHeader.startsWith(
          "Bearer "
        )
          ? authHeader.split(
              " "
            )[1]
          : authHeader;

      // ================= VERIFY =================
      const decoded: any =
        verifyToken(token as string);

      // ================= USER =================
      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!user) {

        return res.status(401).json({
          message:
            "User not found",
        });
      }

      // ================= SAVE USER =================
      req.user = user;

      next();

    } catch (error) {

      return res.status(401).json({
        message:
          "Invalid token",
      });
    }
  };