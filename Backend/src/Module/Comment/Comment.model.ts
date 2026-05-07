import mongoose, { Schema } from "mongoose";
import { IComment } from "./Comment.interface";

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
    },

    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },

    text: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>(
  "Comment",
  commentSchema
);