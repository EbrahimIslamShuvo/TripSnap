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

  bio?: string;

  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };

  otp?: string | undefined;
  otpExpires?: Date | undefined;
}