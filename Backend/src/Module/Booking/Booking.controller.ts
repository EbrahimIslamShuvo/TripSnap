import {
  Request,
  Response,
} from "express";

import {
  BookingService,
} from "./Booking.service";

// ================= CREATE =================
const createBooking =
  async (
    req: any,
    res: Response
  ) => {

    try {

      const payload = {

        user:
          req.user.id,

        tour:
          req.body.tour,

        packageType:
          req.body.packageType,

        totalPeople:
          Number(
            req.body.totalPeople
          ),

        totalCost:
          Number(
            req.body.totalCost
          ),

        transactionId:
          req.body
            .transactionId,
      };

      const result =
        await BookingService.createBooking(
          payload
        );

      res.json({
        success: true,
        message:
          "Booking confirmed",
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

// ================= GET ALL =================
const getAllBookings =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await BookingService.getAllBookings();

      res.json({
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

// ================= MY BOOKINGS =================
const getMyBookings =
  async (
    req: any,
    res: Response
  ) => {

    try {

      const result =
        await BookingService.getMyBookings(
          req.user.id
        );

      res.json({
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

// ================= SINGLE =================
const getSingleBooking =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await BookingService.getSingleBooking(
          req.params.id as string
        );

      res.json({
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

// ================= CANCEL =================
const cancelBooking =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await BookingService.cancelBooking(
          req.params.id as string
        );

      res.json({
        success: true,
        message:
          "Booking cancelled",
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

// ================= COMPLETE =================
const completeBooking =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await BookingService.completeBooking(
          req.params.id as string
        );

      res.json({
        success: true,
        message:
          "Booking completed",
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

  

export const BookingController =
{
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
  completeBooking,
};