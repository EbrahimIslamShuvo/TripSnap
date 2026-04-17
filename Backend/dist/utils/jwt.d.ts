import jwt from "jsonwebtoken";
export declare const createToken: (payload: Record<string, any>) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map