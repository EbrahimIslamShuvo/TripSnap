// ==============================
// Payment.controller.ts
// ==============================

import {
  Request,
  Response
} from "express";

import {
  PaymentService
} from "./Payment.service";

import {
  AuthRequest
} from "../../middleware/auth.middleware";

// ======================================
// CREATE SUBSCRIPTION PAYMENT
// ======================================

const createPayment =
  async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const user =
        req.user;

      const { plan } =
        req.body;

      const result =
        await PaymentService
          .createPaymentIntoDB(
            user,
            plan
          );

      res.status(200).json({
        success: true,
        url: result.url,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// ======================================
// GET ALL PAYMENT
// ======================================

const getAllPayments =
  async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const result =
        await PaymentService
          .getAllPayments();

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

// ======================================
// SUBSCRIPTION SUCCESS
// ======================================

const successPayment =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const transactionId =
        req.params.transactionId;

      await PaymentService
        .paymentSuccess(
          transactionId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/subscription?success=true"
      );

    } catch (err) {

      return res.redirect(
        "http://localhost:5173/dashboard/user/subscription?failed=true"
      );
    }
  };

// ======================================
// SUBSCRIPTION FAIL
// ======================================

const failPayment =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const transactionId =
        req.params.transactionId;

      await PaymentService
        .paymentFail(
          transactionId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/subscription?failed=true"
      );

    } catch (err) {

      console.log(err);
    }
  };

// ======================================
// SUBSCRIPTION CANCEL
// ======================================

const cancelPayment =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const transactionId =
        req.params.transactionId;

      await PaymentService
        .paymentCancel(
          transactionId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/subscription?cancel=true"
      );

    } catch (err) {

      console.log(err);
    }
  };

// ======================================
// CREATE TOUR PAYMENT
// ======================================

const createTourPayment =
  async (
    req: any,
    res: Response
  ) => {

    try {

      const result =
        await PaymentService
          .createTourPaymentService(
            req.body,
            req.user.id
          );

      const apiResponse =
        result.payment;

      if (
        apiResponse?.GatewayPageURL
      ) {

        return res.status(200).json({
          success: true,
          message:
            "Payment URL generated successfully",
          url:
            apiResponse.GatewayPageURL,
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "SSL payment url not generated",
        data:
          apiResponse,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// ======================================
// TOUR PAYMENT SUCCESS
// ======================================

const tourPaymentSuccess =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const bookingId =
        req.params.bookingId;

      await PaymentService
        .tourPaymentSuccess(
          bookingId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/my-tour"
      );

    } catch (err) {

      console.log(err);

      return res.redirect(
        "http://localhost:5173/dashboard/user/my-tour"
      );
    }
  };

// ======================================
// TOUR PAYMENT FAIL
// ======================================

const tourPaymentFail =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const bookingId =
        req.params.bookingId;

      await PaymentService
        .tourPaymentFail(
          bookingId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/my-tour?failed=true"
      );

    } catch (err) {

      console.log(err);
    }
  };

// ======================================
// TOUR PAYMENT CANCEL
// ======================================

const tourPaymentCancel =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const bookingId =
        req.params.bookingId;

      await PaymentService
        .tourPaymentCancel(
          bookingId as string
        );

      return res.redirect(
        "http://localhost:5173/dashboard/user/my-tour?cancel=true"
      );

    } catch (err) {

      console.log(err);
    }
  };

// ======================================
// EXPORT
// ======================================

export const PaymentController =
{
  createPayment,

  successPayment,

  failPayment,

  cancelPayment,

  getAllPayments,

  createTourPayment,

  tourPaymentSuccess,

  tourPaymentFail,

  tourPaymentCancel,
};