import { Types } from "mongoose";
export interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
    role: "user" | "traveler" | "agent" | "admin";
    subscription: {
        status: "free" | "active" | "expired";
        plan?: "monthly" | "quarterly" | "halfYear" | "yearly";
        startDate?: Date;
        endDate?: Date;
    };
    isVerified: boolean;
    bio?: string;
    social?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
    };
    savedPlaces: Types.ObjectId[];
    savedBlogs: Types.ObjectId[];
    otp?: string | undefined;
    otpExpires?: Date | undefined;
}
//# sourceMappingURL=User.interface.d.ts.map