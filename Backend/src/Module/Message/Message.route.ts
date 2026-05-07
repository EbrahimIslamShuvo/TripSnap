import express from "express";

import { MessageController } from "./Message.controller";

const router =
  express.Router();

router.post(
  "/create",
  MessageController.createMessage
);

router.get(
  "/all",
  MessageController.getMessages
);

router.patch(
  "/reply/:id",
  MessageController.replyMessage
);

export const MessageRoutes =
  router;