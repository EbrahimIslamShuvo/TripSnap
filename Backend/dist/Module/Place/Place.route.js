"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const multer_1 = require("../../config/multer");
const Place_Controller_1 = require("./Place.Controller");
const router = express_1.default.Router();
// multiple image upload
const uploadFields = multer_1.upload.fields([
    { name: "image", maxCount: 20 },
    { name: "thumbnailOne", maxCount: 1 },
    { name: "thumbnailTwo", maxCount: 1 },
]);
// CREATE PLACE
router.post("/create", auth_middleware_1.authMiddleware, uploadFields, Place_Controller_1.placeController.createPlace);
// APPROVE PLACE (ADMIN)
router.patch("/approve/:id", auth_middleware_1.authMiddleware, Place_Controller_1.placeController.approvePlace);
exports.PlaceRoutes = router;
//# sourceMappingURL=Place.route.js.map