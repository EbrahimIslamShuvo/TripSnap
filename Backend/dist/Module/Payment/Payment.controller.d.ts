import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
export declare const PaymentController: {
    createPayment: (req: AuthRequest, res: Response) => Promise<void>;
    successPayment: (req: Request, res: Response) => Promise<void>;
    failPayment: (req: Request, res: Response) => Promise<void>;
    cancelPayment: (req: Request, res: Response) => Promise<void>;
    getAllPayments: (req: AuthRequest, res: Response) => Promise<void>;
};
//# sourceMappingURL=Payment.controller.d.ts.map