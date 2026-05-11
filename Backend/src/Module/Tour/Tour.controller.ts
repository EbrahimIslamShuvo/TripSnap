import {
  Request,
  Response,
} from "express";

import mongoose from "mongoose";

import {
  TourService,
} from "./Tour.service";

// ================= CREATE =================
const createTour = async (
  req: any,
  res: Response
) => {

  try {

    const files =
      req.files as any;

    const thumbnailCard =
      files?.thumbnailCard?.[0]
        ?.path;

    const thumbnailDetails =
      files?.thumbnailDetails?.[0]
        ?.path;

    const images =
      files?.images?.map(
        (f: any) => f.path
      ) || [];

    const result =
      await TourService.createTour(
        {
          title:
            req.body.title,

          description:
            req.body.description,

          thumbnailCard,

          thumbnailDetails,

          places: JSON.parse(
            req.body.places
          ),

          packages: {

            single: Number(
              req.body.single
            ),

            couple: Number(
              req.body.couple
            ),

            family: Number(
              req.body.family
            ),
          },

          maxPeople: Number(
            req.body.maxPeople
          ),

          startDate:
            req.body.startDate,

          endDate:
            req.body.endDate,

          images,

          createdBy:
            new mongoose.Types.ObjectId(
              req.user.id
            ),
        }
      );

    res.json({
      success: true,
      message:
        "Tour created successfully",
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

// ================= RELAUNCH =================
const relaunchTour =
  async (
    req: any,
    res: Response
  ) => {

    try {

      const files =
        req.files as any;

      const payload: any = {

        title:
          req.body.title,

        description:
          req.body.description,

        places: JSON.parse(
          req.body.places
        ),

        packages: {

          single: Number(
            req.body.single
          ),

          couple: Number(
            req.body.couple
          ),

          family: Number(
            req.body.family
          ),
        },

        maxPeople: Number(
          req.body.maxPeople
        ),

        // 🔥 MUST NEW DATE
        startDate:
          req.body.startDate,

        endDate:
          req.body.endDate,
      };

      // OPTIONAL IMAGE UPDATE
      if (
        files?.thumbnailCard?.[0]
          ?.path
      ) {

        payload.thumbnailCard =
          files.thumbnailCard[0]
            .path;
      }

      if (
        files
          ?.thumbnailDetails?.[0]
          ?.path
      ) {

        payload.thumbnailDetails =
          files
            .thumbnailDetails[0]
            .path;
      }

      if (
        files?.images?.length >
        0
      ) {

        payload.images =
          files.images.map(
            (f: any) =>
              f.path
          );
      }

      const result =
        await TourService.relaunchTour(
          req.params.id,
          payload
        );

      res.json({
        success: true,
        message:
          "Tour relaunched successfully",
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
const getAllTours =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const tours =
        await TourService.getAllTours();

      res.json({
        success: true,
        data: tours,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// ================= GET SINGLE =================
const getSingleTour =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const tour =
        await TourService.getSingleTour(
          req.params.id as string
        );

      res.json({
        success: true,
        data: tour,
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// ================= SALES =================
const getTourSales =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const result =
        await TourService.getTourSales();

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

  // =====================================
// SEND TOUR UPDATE
// =====================================

const sendTourUpdate =
  async (
    req: any,
    res: Response
  ) => {

    try {

      const {
        tourId,
        message,
      } = req.body;

      const result =
        await TourService.sendTourUpdate(
          tourId,
          message
        );

      res.json({
        success: true,
        message:
          "Update sent successfully",
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

export const TourController = {
  createTour,
  relaunchTour,
  getAllTours,
  getSingleTour,
  getTourSales,
  sendTourUpdate,
};