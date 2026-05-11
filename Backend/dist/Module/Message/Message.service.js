"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Message_model_1 = require("./Message.model");
// ================= CREATE =================
const createMessage = async (payload) => {
    const result = await Message_model_1.Message.create(payload);
    return result;
};
// ================= GET =================
const getMessages = async () => {
    const result = await Message_model_1.Message.find().sort({
        createdAt: -1,
    });
    return result;
};
// ================= REPLY =================
const replyMessage = async (id, reply) => {
    const message = await Message_model_1.Message.findById(id);
    if (!message) {
        throw new Error("Message not found");
    }
    // SAVE
    message.reply = reply;
    message.replied = true;
    await message.save();
    // ================= MAIL =================
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env
                .EMAIL_USER,
            pass: process.env
                .EMAIL_PASS,
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: message.email,
        subject: "Reply From TripSnap",
        html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>Hello ${message.name}</h2>

          <p>${reply}</p>

          <br/>

          <p>TripSnap Team</p>
        </div>
      `,
    });
    return message;
};
exports.MessageService = {
    createMessage,
    getMessages,
    replyMessage,
};
//# sourceMappingURL=Message.service.js.map