// ==============================
// Payment.service.ts
// ==============================

// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";

import { v4 as uuidv4 } from "uuid";

import { Payment } from "./Payment.model";

import { User } from "../User/User.model";

import { Booking } from "../Booking/Booking.model";

// ==========================================
// SSL CONFIG
// ==========================================

const store_id =
  process.env.SSL_STORE_ID as string;

const store_passwd =
  process.env.SSL_STORE_PASS as string;

const is_live =
  process.env.IS_LIVE === "true";

const sslcz =
  new SSLCommerzPayment(
    store_id,
    store_passwd,
    is_live
  );

// ==========================================
// CREATE SUBSCRIPTION PAYMENT
// ==========================================

const createPaymentIntoDB =
  async (
    user: any,
    plan: string
  ) => {

    let amount = 0;

    if (plan === "daily") {

      amount = 29;

    } else if (
      plan === "monthly"
    ) {

      amount = 299;

    } else if (
      plan === "yearly"
    ) {

      amount = 2499;

    } else {

      throw new Error(
        "Invalid Plan"
      );
    }

    const transactionId =
      uuidv4();

    await Payment.create({
      user: user._id,
      amount,
      plan,
      transactionId,
      status: "pending",
    });

    const data = {

      total_amount:
        amount,

      currency:
        "BDT",

      tran_id:
        transactionId,

      success_url:
        `http://localhost:3000/api/payment/success/${transactionId}`,

      fail_url:
        `http://localhost:3000/api/payment/fail/${transactionId}`,

      cancel_url:
        `http://localhost:3000/api/payment/cancel/${transactionId}`,

      ipn_url:
        "http://localhost:3000/ipn",

      shipping_method:
        "NO",

      product_name:
        "TripSnap Premium",

      product_category:
        "Subscription",

      product_profile:
        "general",

      cus_name:
        user.name,

      cus_email:
        user.email,

      cus_add1:
        "Dhaka",

      cus_city:
        "Dhaka",

      cus_country:
        "Bangladesh",

      cus_phone:
        "01700000000",

      ship_name:
        user.name,

      ship_add1:
        "Dhaka",

      ship_city:
        "Dhaka",

      ship_country:
        "Bangladesh",
    };

    const apiResponse =
      await sslcz.init(data);

    return {
      url:
        apiResponse.GatewayPageURL,
    };
  };

// ==========================================
// SUBSCRIPTION SUCCESS
// ==========================================

const paymentSuccess =
  async (
    transactionId: string
  ) => {

    const payment =
      await Payment.findOne({
        transactionId,
      }).populate("user");

    if (!payment) {

      throw new Error(
        "Payment Not Found"
      );
    }

    payment.status =
      "success";

    await payment.save();

    let expireDate =
      new Date();

    if (
      payment.plan ===
      "daily"
    ) {

      expireDate.setDate(
        expireDate.getDate() +
        1
      );

    } else if (
      payment.plan ===
      "monthly"
    ) {

      expireDate.setMonth(
        expireDate.getMonth() +
        1
      );

    } else if (
      payment.plan ===
      "yearly"
    ) {

      expireDate.setFullYear(
        expireDate.getFullYear() +
        1
      );
    }

    await User.findByIdAndUpdate(
      payment.user,

      {
        subscription: {
          plan:
            payment.plan,

          expiresAt:
            expireDate,
        },
      }
    );
  };

// ==========================================
// SUBSCRIPTION FAIL
// ==========================================

const paymentFail =
  async (
    transactionId: string
  ) => {

    await Payment.findOneAndUpdate(
      {
        transactionId,
      },

      {
        status:
          "failed",
      }
    );
  };

// ==========================================
// SUBSCRIPTION CANCEL
// ==========================================

const paymentCancel =
  async (
    transactionId: string
  ) => {

    await Payment.findOneAndUpdate(
      {
        transactionId,
      },

      {
        status:
          "cancelled",
      }
    );
  };

// ==========================================
// GET ALL PAYMENTS
// ==========================================

const getAllPayments =
  async () => {

    const result =
      await Payment.find()
        .populate("user")
        .sort({
          createdAt: -1,
        });

    return result;
  };

// ==========================================
// CREATE TOUR PAYMENT
// ==========================================

const createTourPaymentService =
  async (
    payload: any,
    userId: string
  ) => {

    const {
      tourId,
      packageType,
      quantity,
      travelers,
      amount,
    } = payload;

    const booking: any =
      await Booking.create({
        user: userId,
        tour: tourId,
        packageType,
        quantity,
        travelers,
        amount,
        paymentStatus:
          "pending",
      });

    const data = {

      total_amount:
        Number(amount),

      currency:
        "BDT",

      tran_id:
        String(booking._id),

      success_url:
        `http://localhost:3000/api/payment/tour-success/${booking._id}`,

      fail_url:
        `http://localhost:3000/api/payment/tour-fail/${booking._id}`,

      cancel_url:
        `http://localhost:3000/api/payment/tour-cancel/${booking._id}`,

      ipn_url:
        "http://localhost:3000/ipn",

      shipping_method:
        "NO",

      product_name:
        "Tour Booking",

      product_category:
        "Travel",

      product_profile:
        "general",

      cus_name:
        "Traveler",

      cus_email:
        "traveler@gmail.com",

      cus_add1:
        "Dhaka",

      cus_city:
        "Dhaka",

      cus_postcode:
        "1207",

      cus_country:
        "Bangladesh",

      cus_phone:
        "01700000000",

      ship_name:
        "Traveler",

      ship_add1:
        "Dhaka",

      ship_city:
        "Dhaka",

      ship_postcode:
        "1207",

      ship_country:
        "Bangladesh",
    };

    const apiResponse =
      await sslcz.init(data);

    return {
      booking,
      payment:
        apiResponse,
    };
  };

// ==========================================
// TOUR PAYMENT SUCCESS
// ==========================================

const tourPaymentSuccess =
  async (
    bookingId: string
  ) => {

    await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus:
          "paid",
      }
    );
  };

// ==========================================
// TOUR PAYMENT FAIL
// ==========================================

const tourPaymentFail =
  async (
    bookingId: string
  ) => {

    await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus:
          "failed",
      }
    );
  };

// ==========================================
// TOUR PAYMENT CANCEL
// ==========================================

const tourPaymentCancel =
  async (
    bookingId: string
  ) => {

    await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus:
          "cancelled",
      }
    );
  };

// ==========================================
// EXPORT
// ==========================================

export const PaymentService =
{
  createPaymentIntoDB,

  paymentSuccess,

  paymentFail,

  paymentCancel,

  getAllPayments,

  createTourPaymentService,

  tourPaymentSuccess,

  tourPaymentFail,

  tourPaymentCancel,
};