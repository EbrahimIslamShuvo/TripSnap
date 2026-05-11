import { Booking } from "./Booking.model";

// ================= CREATE =================
const createBooking =
  async (
    payload: any
  ) => {

    return await Booking.create(
      payload
    );
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