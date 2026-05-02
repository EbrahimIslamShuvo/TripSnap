import { IActivity } from "./Activity.interface";
import { Activity } from "./Activity.model";


const createActivity = async (payload: IActivity) => {
  return await Activity.create(payload);
};

const getAllActivities = async () => {
  return await Activity.find()
    .populate("user", "name")
    .populate("blog", "_id title")   
    .populate("place", "_id title") 
    .sort({ createdAt: -1 });
};

export const ActivityService = {
  createActivity,
  getAllActivities,
};