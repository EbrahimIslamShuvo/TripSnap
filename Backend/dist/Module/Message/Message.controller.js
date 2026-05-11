"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const Message_service_1 = require("./Message.service");
// CREATE
const createMessage = async (req, res) => {
    try {
        const result = await Message_service_1.MessageService.createMessage(req.body);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
// GET
const getMessages = async (req, res) => {
    try {
        const result = await Message_service_1.MessageService.getMessages();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
// REPLY
const replyMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        const result = await Message_service_1.MessageService.replyMessage(id, reply);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
exports.MessageController = {
    createMessage,
    getMessages,
    replyMessage,
};
//# sourceMappingURL=Message.controller.js.map