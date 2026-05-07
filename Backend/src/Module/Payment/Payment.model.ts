// ==========================================
// src/Module/Payment/Payment.model.ts
// ==========================================

import mongoose, {
  Schema,
} from "mongoose";
import { IPayment } from "./Payment.Interface";

const paymentSchema =
  new Schema<IPayment>(
    {
      user: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      amount: {
        type: Number,

        required: true,
      },

      plan: {
        type: String,

        enum: [
          "daily",
          "monthly",
          "yearly",
        ],

        required: true,
      },

      transactionId: {
        type: String,

        required: true,
      },

      status: {
        type: String,

        enum: [
          "pending",
          "success",
          "failed",
          "cancelled",
        ],

        default:
          "pending",
      },
    },

    {
      timestamps: true,
    }
  );

export const Payment =
  mongoose.model<IPayment>(
    "Payment",

    paymentSchema
  );