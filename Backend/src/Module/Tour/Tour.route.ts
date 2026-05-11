import express from "express";

import {
  TourController,
} from "./Tour.controller";

import {
  authMiddleware,
} from "../../middleware/auth.middleware";

import {
  upload,
} from "../../config/multer";

const router =
  express.Router();

// ================= CREATE =================
router.post(
  "/create",

  authMiddleware,

  upload.fields([
    {
      name:
        "thumbnailCard",
      maxCount: 1,
    },

    {
      name:
        "thumbnailDetails",
      maxCount: 1,
    },

    {
      name: "images",
      maxCount: 20,
    },
  ]),

  TourController.createTour
);

// ================= RELAUNCH =================
router.post(
  "/relaunch/:id",

  authMiddleware,

  upload.fields([
    {
      name:
        "thumbnailCard",
      maxCount: 1,
    },

    {
      name:
        "thumbnailDetails",
      maxCount: 1,
    },

    {
      name: "images",
      maxCount: 20,
    },
  ]),

  TourController.relaunchTour
);

// ================= GET ALL =================
router.get(
  "/",

  TourController.getAllTours
);

router.post(
  "/send-update",

  authMiddleware,

  TourController.sendTourUpdate
);

// ================= GET SINGLE =================
router.get(
  "/:id",

  TourController.getSingleTour
);

// ================= SALES =================
router.get(
  "/sales/data",

  TourController.getTourSales
);

export const TourRoutes =
  router;