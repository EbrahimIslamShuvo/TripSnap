"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
        default: "",
    },
    replied: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
//# sourceMappingURL=Message.model.js.map