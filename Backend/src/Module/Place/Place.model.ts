import mongoose, { Schema } from "mongoose";
import { IPlace } from "./Place.interface";

const placeSchema = new Schema<IPlace>(
    {
        title: { type: String, required: true },
        description: String,
        location: String,
        country: String,

        thumbnailCard: String,
        thumbnailDetails: String,

        images: [String],

        isActive: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export const Place = mongoose.model<IPlace>("Place", placeSchema);