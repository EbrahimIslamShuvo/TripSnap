"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum: ["BLOG", "PLACE"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    blog: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Blog",
    },
    place: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Place",
    },
}, { timestamps: true });
exports.Activity = (0, mongoose_1.model)("Activity", activitySchema);
//# sourceMappingURL=Activity.model.js.map