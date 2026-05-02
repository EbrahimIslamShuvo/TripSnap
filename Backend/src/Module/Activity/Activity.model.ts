import mongoose, { Schema, model } from "mongoose";
import { IActivity } from "./Activity.interface";

const activitySchema = new Schema<IActivity>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["BLOG", "PLACE"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
        },

        place: {
            type: Schema.Types.ObjectId,
            ref: "Place",
        },
    },
    { timestamps: true }
);

export const Activity = model<IActivity>("Activity", activitySchema);