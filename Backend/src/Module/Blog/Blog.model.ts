import { Schema, model } from "mongoose";
import { IBlog, ISection, ITable } from "./Blog.interface";

const tableSchema = new Schema<ITable>({
  title: String,
  columns: [String],
  rows: [[String]],
});

const sectionSchema = new Schema<ISection>({
  type: {
    type: String,
    enum: ["text", "image", "table", "day"],
    required: true,
  },
  title: String,
  content: String,
  image: String,
  day: Number,
  table: tableSchema,
});

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },

    banner: String,

    gallery: {
      type: [String],
      default: [],
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    places: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],

    isActive: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

export const Blog = model<IBlog>("Blog", blogSchema);