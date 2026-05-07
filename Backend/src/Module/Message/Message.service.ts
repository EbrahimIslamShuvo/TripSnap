import nodemailer from "nodemailer";

import { Message } from "./Message.model";

// ================= CREATE =================
const createMessage =
  async (
    payload: any
  ) => {

    const result =
      await Message.create(
        payload
      );

    return result;
  };

// ================= GET =================
const getMessages =
  async () => {

    const result =
      await Message.find().sort({
        createdAt: -1,
      });

    return result;
  };

// ================= REPLY =================
const replyMessage =
  async (
    id: string,
    reply: string
  ) => {

    const message =
      await Message.findById(
        id
      );

    if (!message) {
      throw new Error(
        "Message not found"
      );
    }

    // SAVE
    message.reply = reply;

    message.replied = true;

    await message.save();

    // ================= MAIL =================
    const transporter =
      nodemailer.createTransport(
        {
          service: "gmail",

          auth: {
            user:
              process.env
                .EMAIL_USER,

            pass:
              process.env
                .EMAIL_PASS,
          },
        }
      );

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: message.email,

      subject:
        "Reply From TripSnap",

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

export const MessageService =
  {
    createMessage,

    getMessages,

    replyMessage,
  };