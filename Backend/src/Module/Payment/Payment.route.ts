import express from "express";

import { PaymentController } from "./Payment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router =
  express.Router();

router.post(
  "/create",
  authMiddleware,
  PaymentController.createPayment
);

router.post(
  "/success/:transactionId",
  PaymentController.successPayment
);

router.post(
  "/fail/:transactionId",
  PaymentController.failPayment
);

router.post(
  "/cancel/:transactionId",
  PaymentController.cancelPayment
);

// GET ALL
router.get(
  "/all",
  authMiddleware,
  PaymentController.getAllPayments
);

export const PaymentRoute =
  router;