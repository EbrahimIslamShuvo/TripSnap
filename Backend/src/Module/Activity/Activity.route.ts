import express from "express";
import { getActivitiesController } from "./Activity.controller";

const activityRoutes = express.Router(); 

activityRoutes.get("/activities", getActivitiesController);

export default activityRoutes;