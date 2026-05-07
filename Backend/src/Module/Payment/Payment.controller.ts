import { Request, Response } from "express";

import { PaymentService } from "./Payment.service";
import { AuthRequest } from "../../middleware/auth.middleware";

// ======================================
// CREATE PAYMENT
// ======================================

const createPayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const user = req.user;

    const { plan } = req.body;

    const result =
      await PaymentService.createPaymentIntoDB(
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
      message: err.message,
    });
  }
};


// =====================================
// GET ALL PAYMENT
// =====================================

// ======================================
// GET ALL PAYMENTS
// ======================================

const getAllPayments =
  async (
    req: AuthRequest,
    res: Response
  ) => {

    try {

      const result =
        await PaymentService.getAllPayments();

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };


// ==========================================

const successPayment = async (
  req: Request,
  res: Response
) => {

  try {

    const transactionId =
      typeof req.params.transactionId ===
      "string"
        ? req.params.transactionId
        : "";

    await PaymentService.paymentSuccess(
      transactionId
    );

    return res.redirect(
      "http://localhost:5173/dashboard/user/subscription?success=true"
    );

  } catch (err) {

    console.log(err);

    return res.redirect(
      "http://localhost:5173/dashboard/user/subscription?failed=true"
    );
  }
};

// ==========================================

const failPayment = async (
  req: Request,
  res: Response
) => {

  try {

    const transactionId =
      typeof req.params.transactionId ===
      "string"
        ? req.params.transactionId
        : "";

    await PaymentService.paymentFail(
      transactionId
    );

    return res.redirect(
      "http://localhost:5173/dashboard/user/subscription?failed=true"
    );

  } catch (err) {

    console.log(err);
  }
};

// ==========================================

const cancelPayment = async (
  req: Request,
  res: Response
) => {

  try {

    const transactionId =
      typeof req.params.transactionId ===
      "string"
        ? req.params.transactionId
        : "";

    await PaymentService.paymentCancel(
      transactionId
    );

    return res.redirect(
      "http://localhost:5173/dashboard/user/subscription?cancel=true"
    );

  } catch (err) {

    console.log(err);
  }
};

export const PaymentController =
  {
    createPayment,

    successPayment,

    failPayment,

    cancelPayment,
    getAllPayments
  };