import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const createToken = (payload: object) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not found ❌");
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};