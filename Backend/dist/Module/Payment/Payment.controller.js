"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const Payment_service_1 = require("./Payment.service");
// ======================================
// CREATE PAYMENT
// ======================================
const createPayment = async (req, res) => {
    try {
        const user = req.user;
        const { plan } = req.body;
        const result = await Payment_service_1.PaymentService.createPaymentIntoDB(user, plan);
        res.status(200).json({
            success: true,
            url: result.url,
        });
    }
    catch (err) {
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
const getAllPayments = async (req, res) => {
    try {
        const result = await Payment_service_1.PaymentService.getAllPayments();
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
// ==========================================
const successPayment = async (req, res) => {
    try {
        const transactionId = typeof req.params.transactionId ===
            "string"
            ? req.params.transactionId
            : "";
        await Payment_service_1.PaymentService.paymentSuccess(transactionId);
        return res.redirect("http://localhost:5173/dashboard/user/subscription?success=true");
    }
    catch (err) {
        console.log(err);
        return res.redirect("http://localhost:5173/dashboard/user/subscription?failed=true");
    }
};
// ==========================================
const failPayment = async (req, res) => {
    try {
        const transactionId = typeof req.params.transactionId ===
            "string"
            ? req.params.transactionId
            : "";
        await Payment_service_1.PaymentService.paymentFail(transactionId);
        return res.redirect("http://localhost:5173/dashboard/user/subscription?failed=true");
    }
    catch (err) {
        console.log(err);
    }
};
// ==========================================
const cancelPayment = async (req, res) => {
    try {
        const transactionId = typeof req.params.transactionId ===
            "string"
            ? req.params.transactionId
            : "";
        await Payment_service_1.PaymentService.paymentCancel(transactionId);
        return res.redirect("http://localhost:5173/dashboard/user/subscription?cancel=true");
    }
    catch (err) {
        console.log(err);
    }
};
exports.PaymentController = {
    createPayment,
    successPayment,
    failPayment,
    cancelPayment,
    getAllPayments
};
//# sourceMappingURL=Payment.controller.js.map