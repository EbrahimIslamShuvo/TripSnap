export declare const UserService: {
    registerUser: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    verifyOTP: (email: string, otp: string) => Promise<boolean>;
    loginUser: (payload: any) => Promise<{
        user: import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        token: string;
    }>;
    forgotPassword: (email: string) => Promise<boolean>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>;
};
//# sourceMappingURL=User.service.d.ts.map