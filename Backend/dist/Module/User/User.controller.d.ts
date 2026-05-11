import { Request, Response } from "express";
export declare const getSingleUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const UserController: {
    register: (req: any, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    forgotPassword: (req: Request, res: Response) => Promise<void>;
    verifyOTP: (req: Request, res: Response) => Promise<void>;
    resetPassword: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: any, res: Response) => Promise<void>;
    changePassword: (req: any, res: Response) => Promise<void>;
    getAllUsers: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    getSingleUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    savePlace: (req: any, res: Response) => Promise<void>;
    saveBlog: (req: any, res: Response) => Promise<void>;
    createTravelerOrAgent: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=User.controller.d.ts.map