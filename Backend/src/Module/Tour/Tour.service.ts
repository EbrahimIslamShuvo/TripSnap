import { sendEmail } from "../../utils/sendEmail";
import { Booking } from "../Booking/Booking.model";
import { Tour } from "./Tour.model";

// ================= CREATE =================
const createTour = async (
  payload: any
) => {

  return await Tour.create(
    payload
  );
};

// ================= RELAUNCH =================
const relaunchTour =
  async (
    id: string,
    payload: any
  ) => {

    const oldTour =
      await Tour.findById(id);

    if (!oldTour) {
      throw new Error(
        "Tour not found"
      );
    }

    const newTour =
      await Tour.create({
        title:
          payload.title ||
          oldTour.title,

        description:
          payload.description ||
          oldTour.description,

        thumbnailCard:
          payload.thumbnailCard ||
          oldTour.thumbnailCard,

        thumbnailDetails:
          payload.thumbnailDetails ||
          oldTour.thumbnailDetails,

        places:
          payload.places ||
          oldTour.places,

        packages:
          payload.packages ||
          oldTour.packages,

        maxPeople:
          payload.maxPeople ||
          oldTour.maxPeople,

        startDate:
          payload.startDate,

        endDate:
          payload.endDate,

        images:
          payload.images
            ?.length > 0
            ? payload.images
            : oldTour.images,

        createdBy:
          oldTour.createdBy,

        // 🔥 SOURCE TOUR
        parentTour:
          oldTour._id,
      });

    return newTour;
  };

// ================= GET ALL =================
const getAllTours =
  async () => {

    const tours =
      await Tour.find()

        .populate("places")

        .populate("createdBy")

        .populate("parentTour")

        .sort({
          createdAt: -1,
        });

    const toursWithSeats =
      await Promise.all(

        tours.map(
          async (tour: any) => {

            // 🔥 PAID BOOKINGS
            const paidBookings =
              await Booking.find({

                tour: tour._id,

                paymentStatus:
                  "paid",
              });

            // 🔥 TOTAL BOOKED SEATS
            const bookedSeats =
              paidBookings.reduce(

                (
                  total,
                  booking: any
                ) => {

                  return (
                    total +
                    booking.travelers
                  );
                },

                0
              );

            return {

              ...tour.toObject(),

              bookedSeats,

              remainingSeats:
                tour.maxPeople -
                bookedSeats,
            };
          }
        )
      );

    return toursWithSeats;
  };

// ================= GET SINGLE =================
const getSingleTour =
  async (
    id: string
  ) => {

    const tour: any =
      await Tour.findById(id)

        .populate("places")

        .populate("createdBy")

        .populate("parentTour");

    if (!tour) {

      throw new Error(
        "Tour not found"
      );
    }

    // 🔥 PAID BOOKINGS
    const paidBookings =
      await Booking.find({

        tour: tour._id,

        paymentStatus:
          "paid",
      });

    // 🔥 TOTAL BOOKED SEATS
    const bookedSeats =
      paidBookings.reduce(

        (
          total,
          booking: any
        ) => {

          return (
            total +
            booking.travelers
          );
        },

        0
      );

    return {

      ...tour.toObject(),

      bookedSeats,

      remainingSeats:
        tour.maxPeople -
        bookedSeats,
    };
  };


// ================= SALES =================
const getTourSales =
  async () => {

    const result =
      await Tour.aggregate([
        {
          $group: {
            _id: null,

            totalTours: {
              $sum: 1,
            },

            avgSingle: {
              $avg:
                "$packages.single",
            },

            avgCouple: {
              $avg:
                "$packages.couple",
            },

            avgFamily: {
              $avg:
                "$packages.family",
            },
          },
        },
      ]);

    return result[0];
  };

  const sendTourUpdate =
  async (
    tourId: string,
    message: string
  ) => {

    // =====================================
    // GET BOOKINGS
    // =====================================

    const bookings =
      await Booking.find({

        tour: tourId,

        paymentStatus:
          "paid",
      })

        .populate("user")

        .populate("tour");

    if (
      bookings.length === 0
    ) {

      throw new Error(
        "No travelers found"
      );
    }

    // =====================================
    // SEND MAIL
    // =====================================

    for (const booking of bookings) {

      const user: any =
        booking.user;

      const tour: any =
        booking.tour;

      await sendEmail(

        user.email,

        `
        <div style="font-family:Arial;padding:40px;background:#f4f4f4;">

          <div style="max-width:700px;margin:auto;background:white;border-radius:16px;overflow:hidden;">

            <div style="background:#32AEBB;padding:30px;text-align:center;color:white;">

              <h1>
                Tour Update
              </h1>

            </div>

            <div style="padding:40px;">

              <h2>
                Hello ${user.name},
              </h2>

              <p>
                New update for your booked tour:
              </p>

              <h3 style="color:#32AEBB;">
                ${tour.title}
              </h3>

              <div style="
                background:#f9fafb;
                border-radius:12px;
                padding:25px;
                margin-top:20px;
                line-height:1.8;
              ">

                ${message}

              </div>

            </div>

            <div style="
              background:#f3f4f6;
              text-align:center;
              padding:20px;
              font-size:13px;
              color:#666;
            ">

              © ${new Date().getFullYear()} TripSnap

            </div>

          </div>

        </div>
        `
      );
    }

    return {
      success: true,
    };
  };

export const TourService = {
  createTour,
  relaunchTour,
  getAllTours,
  getSingleTour,
  getTourSales,
  sendTourUpdate,
};