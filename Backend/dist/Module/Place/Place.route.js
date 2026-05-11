"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const Place_Controller_1 = require("./Place.Controller");
const multer_1 = require("../../config/multer");
const router = express_1.default.Router();
const uploadFields = multer_1.upload.fields([
    { name: "thumbnailCard", maxCount: 1 },
    { name: "thumbnailDetails", maxCount: 1 },
    { name: "images", maxCount: 20 }, // 🔥 must match frontend
]);
router.post("/create", auth_middleware_1.authMiddleware, uploadFields, Place_Controller_1.placeController.createPlace);
router.get("/all", Place_Controller_1.placeController.getAllPlaces);
router.patch("/approve/:id", auth_middleware_1.authMiddleware, Place_Controller_1.placeController.approvePlace);
// GET travelers PLACES
router.get("/my", auth_middleware_1.authMiddleware, Place_Controller_1.placeController.getMyPlaces);
router.get("/:id", Place_Controller_1.placeController.getSinglePlace);
exports.PlaceRoutes = router;
//# sourceMappingURL=Place.route.js.map