"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, otp) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: `"TripSnap" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your OTP Code",
            html: `<h2>Your OTP is: ${otp}</h2>`,
        });
        console.log("✅ Email sent");
    }
    catch (err) {
        console.error("❌ Email error:", err);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map