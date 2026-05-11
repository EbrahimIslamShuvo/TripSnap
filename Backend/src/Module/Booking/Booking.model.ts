import {
    Schema,
    model,
} from "mongoose";

import { IBooking } from "./Booking.interface";

const bookingSchema =
    new Schema<IBooking>(
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            tour: {
                type: Schema.Types.ObjectId,
                ref: "Tour",
                required: true,
            },

            packageType: {
                type: String,
                required: true,
            },

            quantity: {
                type: Number,
                required: true,
            },

            travelers: {
                type: Number,
                required: true,
            },

            amount: {
                type: Number,
                required: true,
            },

            paymentStatus: {
                type: String,
                enum: [
                    "pending",
                    "paid",
                ],
                default: "pending",
            },

            transactionId: {
                type: String,
            },
        },
        {
            timestamps: true,
        }
    );

export const Booking =
    model<IBooking>(
        "Booking",
        bookingSchema
    );