import { Types } from "mongoose";

export interface IComment {
  user: Types.ObjectId;

  blog?: Types.ObjectId;

  place?: Types.ObjectId;

  text: string;

  image?: string;

  createdAt?: Date;
  updatedAt?: Date;
}