"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivitiesController = void 0;
const Activity_service_1 = require("./Activity.service");
const getActivitiesController = async (req, res) => {
    try {
        const data = await Activity_service_1.ActivityService.getAllActivities();
        res.json({
            success: true,
            data,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.getActivitiesController = getActivitiesController;
//# sourceMappingURL=Activity.controller.js.map