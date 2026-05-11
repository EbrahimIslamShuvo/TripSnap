"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const Activity_model_1 = require("./Activity.model");
const createActivity = async (payload) => {
    return await Activity_model_1.Activity.create(payload);
};
const getAllActivities = async () => {
    return await Activity_model_1.Activity.find()
        .populate("user", "name")
        .populate("blog", "_id title")
        .populate("place", "_id title")
        .sort({ createdAt: -1 });
};
exports.ActivityService = {
    createActivity,
    getAllActivities,
};
//# sourceMappingURL=Activity.service.js.map