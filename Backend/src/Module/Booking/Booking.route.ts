import express from "express";

import {
  BookingController,
} from "./Booking.controller";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

const router =
  express.Router();

// ================= CREATE =================
router.post(
  "/create",

  authMiddleware,

  BookingController.createBooking
);

// ================= GET ALL =================
router.get(
  "/",

  authMiddleware,

  BookingController.getAllBookings
);

// ================= MY BOOKINGS =================
router.get(
  "/my",

  authMiddleware,

  BookingController.getMyBookings
);

// ================= SINGLE =================
router.get(
  "/:id",

  authMiddleware,

  BookingController.getSingleBooking
);

// ================= CANCEL =================
router.put(
  "/cancel/:id",

  authMiddleware,

  BookingController.cancelBooking
);

// ================= COMPLETE =================
router.put(
  "/complete/:id",

  authMiddleware,

  BookingController.completeBooking
);

export const BookingRoutes =
  router;