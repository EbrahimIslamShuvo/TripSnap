export declare const UserService: {
    registerUser: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
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
    forgotPassword: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
    updateProfile: (userId: string, payload: any, file?: any) => Promise<import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    changePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<void>;
    getAllUsers: () => Promise<(import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getSingleUser: (id: string) => Promise<import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    savePlace: (userId: string, placeId: string) => Promise<{
        saved: boolean;
        message: string;
    }>;
    saveBlog: (userId: string, blogId: string) => Promise<{
        saved: boolean;
        message: string;
    }>;
    createTravelerOrAgent: (payload: any) => Promise<import("mongoose").Document<unknown, {}, import("./User.interface").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("./User.interface").IUser & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
};
//# sourceMappingURL=User.service.d.ts.map