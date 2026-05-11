"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Message_controller_1 = require("./Message.controller");
const router = express_1.default.Router();
router.post("/create", Message_controller_1.MessageController.createMessage);
router.get("/all", Message_controller_1.MessageController.getMessages);
router.patch("/reply/:id", Message_controller_1.MessageController.replyMessage);
exports.MessageRoutes = router;
//# sourceMappingURL=Message.route.js.map