export interface IUser {
    name: string;
    email: string;
    password: string;
    image: string;
    role: "user" | "traveler" | "admin";
    subscription: {
        status: "free" | "active" | "expired";
    };
    isVerified: boolean;
    otp?: string;
    otpExpires?: Date;
}
//# sourceMappingURL=User.interface.d.ts.map