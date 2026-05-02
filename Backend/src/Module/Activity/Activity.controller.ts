import { Request, Response } from "express";
import { ActivityService } from "./Activity.service";

export const getActivitiesController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await ActivityService.getAllActivities();

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};