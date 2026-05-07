import {
  Request,
  Response,
} from "express";

import { MessageService } from "./Message.service";

// CREATE
const createMessage =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await MessageService.createMessage(
          req.body
        );

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// GET
const getMessages =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await MessageService.getMessages();

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// REPLY
const replyMessage =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { id } =
        req.params;

      const { reply } =
        req.body;

      const result =
        await MessageService.replyMessage(
          id as string,
          reply
        );

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

export const MessageController =
  {
    createMessage,

    getMessages,

    replyMessage,
  };