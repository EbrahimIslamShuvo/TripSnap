export declare const PaymentService: {
    createPaymentIntoDB: (user: any, plan: string) => Promise<{
        url: any;
    }>;
    paymentSuccess: (transactionId: string) => Promise<void>;
    paymentFail: (transactionId: string) => Promise<void>;
    paymentCancel: (transactionId: string) => Promise<void>;
    getAllPayments: () => Promise<(import("mongoose").Document<unknown, {}, import("./Payment.Interface").IPayment, {}, import("mongoose").DefaultSchemaOptions> & import("./Payment.Interface").IPayment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=Payment.service.d.ts.map