"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Activity_controller_1 = require("./Activity.controller");
const activityRoutes = express_1.default.Router();
activityRoutes.get("/activities", Activity_controller_1.getActivitiesController);
exports.default = activityRoutes;
//# sourceMappingURL=Activity.route.js.map