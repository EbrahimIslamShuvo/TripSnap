import { Types } from "mongoose";

export interface IActivity {
  user: Types.ObjectId;
  type: "BLOG" | "PLACE";
  message: string;
  blog?: Types.ObjectId; 
  place?: Types.ObjectId; 
  createdAt?: Date;
  updatedAt?: Date;
}