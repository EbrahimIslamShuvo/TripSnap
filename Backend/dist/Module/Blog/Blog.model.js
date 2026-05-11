"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    title: String,
    columns: [String],
    rows: [[String]],
});
const sectionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["text", "image", "table", "day"],
        required: true,
    },
    title: String,
    content: String,
    image: String,
    day: Number,
    table: tableSchema,
});
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    banner: String,
    gallery: {
        type: [String],
        default: [],
    },
    sections: {
        type: [sectionSchema],
        default: [],
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    places: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Place",
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.Blog = (0, mongoose_1.model)("Blog", blogSchema);
//# sourceMappingURL=Blog.model.js.map