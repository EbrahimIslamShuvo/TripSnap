import mongoose, { Schema } from "mongoose";
import { IUser } from "./User.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    bio: {
      type: String,
    },

    social: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      youtube: { type: String },
    },

    role: {
      type: String,
      enum: ["user", "traveler", "agent", "admin"],
      default: "user",
    },

    // 🔥 SUBSCRIPTION
    subscription: {
      status: {
        type: String,
        enum: ["free", "active", "expired"],
        default: "free",
      },

      plan: {
        type: String,
        enum: ["monthly", "quarterly", "halfYear", "yearly"],
      },

      startDate: {
        type: Date,
      },

      endDate: {
        type: Date,
      },
    },

    // 🔥 VERIFY
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🔥 SAVED PLACES
    savedPlaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

    // 🔥 SAVED BLOGS
    savedBlogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    // 🔥 OTP
    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);