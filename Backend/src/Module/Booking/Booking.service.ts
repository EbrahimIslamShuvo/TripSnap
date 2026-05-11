import { Tour } from "../Tour/Tour.model";
import { Booking } from "./Booking.model";

// ================= CREATE =================
const createBooking = async (
  payload: any
) => {

  // 🔥 FIND TOUR
  const tour =
    await Tour.findById(
      payload.tour
    );

  if (!tour) {

    throw new Error(
      "Tour not found"
    );
  }

  // =====================================
  // 🔥 SAME TOUR CHECK
  // =====================================

  const sameTourBooking =
    await Booking.findOne({

      user: payload.user,

      tour: tour._id,
    });

  if (sameTourBooking) {

    throw new Error(
      "You already booked this tour"
    );
  }

  // =====================================
  // 🔥 SAME DATE CHECK
  // =====================================

  const existingBookings =
    await Booking.find({
      user: payload.user,
    }).populate("tour");

  const alreadyBooked =
    existingBookings.find(
      (booking: any) => {

        const bookedTour =
          booking.tour;

        return (

          new Date(
            bookedTour.startDate
          ).toDateString()

          ===

          new Date(
            tour.startDate
          ).toDateString()
        );
      }
    );

  if (alreadyBooked) {

    throw new Error(
      "You already booked another tour on this date"
    );
  }

  // =====================================
  // 🔥 CREATE BOOKING
  // =====================================

  try {

    return await Booking.create(
      payload
    );

  } catch (err: any) {

    // 🔥 DUPLICATE ERROR
    if (err.code === 11000) {

      throw new Error(
        "You already booked this tour"
      );
    }

    throw err;
  }
};

// ================= GET ALL =================
const getAllBookings =
  async () => {

    return await Booking.find()

      .populate("user")

      .populate("tour")

      .sort({
        createdAt: -1,
      });
  };

// ================= MY BOOKINGS =================
const getMyBookings =
  async (
    userId: string
  ) => {

    return await Booking.find({
      user: userId,
    })

      .populate("tour")

      .sort({
        createdAt: -1,
      });
  };

// ================= SINGLE =================
const getSingleBooking =
  async (
    id: string
  ) => {

    return await Booking.findById(
      id
    )

      .populate("user")

      .populate("tour");
  };

// ================= CANCEL =================
const cancelBooking =
  async (
    id: string
  ) => {

    return await Booking.findByIdAndUpdate(

      id,

      {
        bookingStatus:
          "cancelled",
      },

      {
        new: true,
      }
    );
  };

// ================= COMPLETE =================
const completeBooking =
  async (
    id: string
  ) => {

    return await Booking.findByIdAndUpdate(

      id,

      {
        bookingStatus:
          "completed",
      },

      {
        new: true,
      }
    );
  };

export const BookingService =
{
  createBooking,
  getAllBookings,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
  completeBooking,
};