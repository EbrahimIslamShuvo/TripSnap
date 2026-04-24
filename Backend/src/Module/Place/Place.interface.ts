import { Types } from "mongoose";

export interface IPlace {
  title: string;
  description: string;
  location: string;
  country: string;

  thumbnailCard: string;
  thumbnailDetails: string;

  images: string[]; 

  isActive: boolean;

  createdBy: Types.ObjectId;
}