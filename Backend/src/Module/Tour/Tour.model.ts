import mongoose, {
  Schema,
  model,
} from "mongoose";

import {
  ITour,
} from "./Tour.interface";

const tourSchema =
  new Schema<ITour>(
    {
      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      thumbnailCard: {
        type: String,
        required: true,
      },

      places: [
        {
          type:
            Schema.Types.ObjectId,

          ref: "Place",
        },
      ],

      thumbnailDetails: {
        type: String,
        required: true,
      },

      packages: {

        single: {
          type: Number,
          required: true,
        },

        couple: {
          type: Number,
          required: true,
        },

        family: {
          type: Number,
          required: true,
        },
      },

      maxPeople: {
        type: Number,
        required: true,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      images: {
        type: [String],
        default: [],
      },

      createdBy: {
        type:
          Schema.Types.ObjectId,

        ref: "User",
      },

      // 🔥 PARENT TOUR
      parentTour: {
        type:
          Schema.Types.ObjectId,

        ref: "Tour",
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const Tour =
  model<ITour>(
    "Tour",
    tourSchema
  );