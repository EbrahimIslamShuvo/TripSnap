import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { placeController } from "./Place.Controller";
import { upload } from "../../config/multer";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "thumbnailCard", maxCount: 1 },
  { name: "thumbnailDetails", maxCount: 1 },
  { name: "images", maxCount: 20 }, // 🔥 must match frontend
]);

router.post(
  "/create",
  authMiddleware,
  uploadFields,
  placeController.createPlace
);

router.get("/all", placeController.getAllPlaces);
router.patch("/approve/:id", authMiddleware, placeController.approvePlace);

// GET travelers PLACES
router.get(
  "/my",
  authMiddleware,
  placeController.getMyPlaces
);
router.get("/:id", placeController.getSinglePlace);


export const PlaceRoutes = router;