import express from "express";

import { PaymentController } from "./Payment.controller";

import { authMiddleware } from "../../middleware/auth.middleware";

const router =
  express.Router();

// ======================================
// SUBSCRIPTION PAYMENT
// ======================================

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

// ======================================
// TOUR PAYMENT
// ======================================

router.post(
  "/create-tour-payment",
  authMiddleware,
  PaymentController.createTourPayment
);

router.post(
  "/tour-success/:bookingId",
  PaymentController.tourPaymentSuccess
);

router.post(
  "/tour-fail/:bookingId",
  PaymentController.tourPaymentFail
);

router.post(
  "/tour-cancel/:bookingId",
  PaymentController.tourPaymentCancel
);

// ======================================
// GET ALL PAYMENT
// ======================================

router.get(
  "/all",
  authMiddleware,
  PaymentController.getAllPayments
);

export const PaymentRoute =
  router;