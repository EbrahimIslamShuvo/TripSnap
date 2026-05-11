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

        .populate(
          "createdBy"
        )

        .populate(
          "parentTour"
        )

        .sort({
          createdAt: -1,
        });

    const toursWithSeats =
      await Promise.all(

        tours.map(
          async (tour) => {

            // 🔥 BOOKED
            const bookedSeats =
              await Booking.countDocuments({
                tour: tour._id,

                bookingStatus:
                  "confirmed",
              });

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

    return await Tour.findById(
      id
    )

      .populate("places")

      .populate(
        "createdBy"
      )

      .populate(
        "parentTour"
      );
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

export const TourService = {
  createTour,
  relaunchTour,
  getAllTours,
  getSingleTour,
  getTourSales,
};