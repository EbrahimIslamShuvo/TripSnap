import {
  Schema,
  model,
} from "mongoose";

import { IMessage } from "./Message.interface";

const messageSchema =
  new Schema<IMessage>(
    {
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
    },
    {
      timestamps: true,
    }
  );

export const Message =
  model<IMessage>(
    "Message",
    messageSchema
  );