// @ts-ignore
import SSLCommerzPayment from "sslcommerz-lts";

import { v4 as uuidv4 } from "uuid";

import { Payment } from "./Payment.model";

import { User } from "../User/User.model";

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
// CREATE PAYMENT
// ==========================================

const createPaymentIntoDB =
    async (
        user: any,
        plan: string
    ) => {

        // ================= PRICE =================
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

        // ================= TRANSACTION ID =================
        const transactionId =
            uuidv4();

        // ================= SAVE PAYMENT =================
        await Payment.create({
            user: user._id,

            amount,

            plan,

            transactionId,

            status: "pending",
        });

        // ================= SSL DATA =================
        const data = {

            total_amount:
                amount,

            currency: "BDT",

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

        // ================= SSL INIT =================
        const apiResponse =
            await sslcz.init(data);

        return {
            url:
                apiResponse.GatewayPageURL,
        };
    };

// ==========================================
// SUCCESS
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

        // ================= UPDATE PAYMENT =================
        payment.status =
            "success";

        await payment.save();

        // ================= EXPIRE DATE =================
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

        // ================= UPDATE USER =================
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
// FAIL
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
                status: "failed",
            }
        );
    };

// ==========================================
// CANCEL
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
                status: "cancelled",
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
        .populate(
          "user"
        )
        .sort({
          createdAt: -1,
        });

    return result;
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

    getAllPayments
};