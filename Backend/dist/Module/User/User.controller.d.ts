import { Request, Response } from "express";
export declare const UserController: {
    register: (req: any, res: Response) => Promise<void>;
    verifyOTP: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=User.controller.d.ts.map