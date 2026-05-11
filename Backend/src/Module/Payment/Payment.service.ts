// ==============================
// Payment.service.ts
// ==============================

// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";

import { v4 as uuidv4 } from "uuid";

import { Payment } from "./Payment.model";

import { User } from "../User/User.model";

import { Booking } from "../Booking/Booking.model";
import { sendEmail } from "../../utils/sendEmail";
import { Tour } from "../Tour/Tour.model";

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

    // ======================================
    // 🔥 FIND CURRENT TOUR
    // ======================================

    const currentTour: any =
      await Tour.findById(
        tourId
      );

    if (!currentTour) {

      throw new Error(
        "Tour not found"
      );
    }

    // ======================================
    // 🔥 SAME TOUR CHECK
    // ======================================

    const sameTourBooking =
      await Booking.findOne({

        user: userId,

        tour: tourId,

        paymentStatus: {
          $nin: [
            "failed",
            "cancelled",
          ],
        },
      });

    if (sameTourBooking) {

      throw new Error(
        "You already booked this tour"
      );
    }

    // ======================================
    // 🔥 DATE OVERLAP CHECK
    // ======================================

    const userBookings =
      await Booking.find({

        user: userId,

        paymentStatus: {
          $nin: [
            "failed",
            "cancelled",
          ],
        },
      }).populate("tour");

    const hasOverlappingTour =
      userBookings.some(
        (booking: any) => {

          const bookedTour =
            booking.tour;

          const bookedStart =
            new Date(
              bookedTour.startDate
            );

          const bookedEnd =
            new Date(
              bookedTour.endDate
            );

          const currentStart =
            new Date(
              currentTour.startDate
            );

          const currentEnd =
            new Date(
              currentTour.endDate
            );

          return (
            currentStart <= bookedEnd &&
            currentEnd >= bookedStart
          );
        }
      );

    if (hasOverlappingTour) {

      throw new Error(
        "You already booked another tour on overlapping dates"
      );
    }

    // ======================================
    // 🔥 CREATE BOOKING
    // ======================================

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

    // ======================================
    // 🔥 SSL DATA
    // ======================================

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

    // ======================================
    // 🔥 UPDATE PAYMENT STATUS
    // ======================================

    const booking: any =
      await Booking.findByIdAndUpdate(

        bookingId,

        {
          paymentStatus:
            "paid",
        },

        {
          new: true,
        }
      )

        .populate("user")

        .populate("tour");

    if (!booking) {

      throw new Error(
        "Booking not found"
      );
    }

    const user =
      booking.user;

    const tour =
      booking.tour;

    // ======================================
    // 🔥 SEND INVOICE EMAIL
    // ======================================

    await sendEmail(

      user.email,

      `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">

        <div style="max-width:700px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">

          <!-- HEADER -->
          <div style="background:#32AEBB; padding:35px; text-align:center; color:white;">

            <h1 style="margin:0; font-size:32px;">
              TripSnap Tour Invoice
            </h1>

            <p style="margin-top:10px; font-size:15px;">
              Your booking has been confirmed successfully
            </p>

          </div>

          <!-- BODY -->
          <div style="padding:40px; color:#333;">

            <h2 style="margin-bottom:20px;">
              Hello ${user.name},
            </h2>

            <p style="line-height:1.8;">
              Thank you for booking with TripSnap.
              Your payment has been received successfully.
            </p>

            <!-- BOOKING DETAILS -->
            <div style="
              margin-top:30px;
              border:1px solid #e5e7eb;
              border-radius:14px;
              padding:30px;
              background:#fafafa;
            ">

              <h3 style="
                margin-top:0;
                margin-bottom:25px;
                color:#32AEBB;
              ">
                Booking Details
              </h3>

              <p style="margin:10px 0;">
                <strong>Tour:</strong>
                ${tour.title}
              </p>

              <p style="margin:10px 0;">
                <strong>Package:</strong>
                ${booking.packageType}
              </p>

              <p style="margin:10px 0;">
                <strong>Quantity:</strong>
                ${booking.quantity}
              </p>

              <p style="margin:10px 0;">
                <strong>Travelers:</strong>
                ${booking.travelers}
              </p>

              <p style="margin:10px 0;">
                <strong>Total Amount:</strong>
                ৳ ${booking.amount}
              </p>

              <p style="margin:10px 0;">
                <strong>Tour Start Date:</strong>
                ${new Date(
        tour.startDate
      ).toLocaleDateString()}
              </p>

              <p style="margin:10px 0;">
                <strong>Tour End Date:</strong>
                ${new Date(
        tour.endDate
      ).toLocaleDateString()}
              </p>

              <p style="margin:10px 0;">
                <strong>Payment Status:</strong>

                <span style="
                  color:green;
                  font-weight:bold;
                ">
                  Paid
                </span>
              </p>

              <p style="margin:10px 0;">
                <strong>Booking Date:</strong>
                ${new Date(
        booking.createdAt
      ).toLocaleDateString()}
              </p>

            </div>

            <!-- BUTTON -->
            <div style="
              margin-top:35px;
              text-align:center;
            ">

              <a
                href="http://localhost:5173/dashboard/user/my-tour"

                style="
                  display:inline-block;
                  background:#32AEBB;
                  color:white;
                  text-decoration:none;
                  padding:14px 30px;
                  border-radius:10px;
                  font-weight:bold;
                  font-size:16px;
                "
              >
                View My Tours
              </a>

            </div>

          </div>

          <!-- FOOTER -->
          <div style="
            background:#f3f4f6;
            padding:20px;
            text-align:center;
            font-size:13px;
            color:#666;
          ">

            © ${new Date().getFullYear()} TripSnap.
            All rights reserved.

          </div>

        </div>

      </div>
      `
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