"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const Payment_controller_1 = require("./Payment.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/create", auth_middleware_1.authMiddleware, Payment_controller_1.PaymentController.createPayment);
router.post("/success/:transactionId", Payment_controller_1.PaymentController.successPayment);
router.post("/fail/:transactionId", Payment_controller_1.PaymentController.failPayment);
router.post("/cancel/:transactionId", Payment_controller_1.PaymentController.cancelPayment);
// GET ALL
router.get("/all", auth_middleware_1.authMiddleware, Payment_controller_1.PaymentController.getAllPayments);
exports.PaymentRoute = router;
//# sourceMappingURL=Payment.route.js.map