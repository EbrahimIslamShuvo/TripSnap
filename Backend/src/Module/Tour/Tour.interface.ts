import { Types } from "mongoose";

export interface ITour {

  title: string;

  description: string;

  thumbnailCard: string;

  thumbnailDetails: string;

  places: Types.ObjectId[];

  packages: {
    single: number;

    couple: number;

    family: number;
  };

  maxPeople: number;

  startDate: Date;

  endDate: Date;

  images: string[];

  createdBy: Types.ObjectId;

  // 🔥 RELAUNCH SOURCE
  parentTour?: Types.ObjectId;

  isActive: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}