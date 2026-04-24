"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeController = void 0;
const Place_service_1 = require("./Place.service");
const createPlace = async (req, res) => {
    try {
        const result = await Place_service_1.PlaceService.createPlace(req.body, req.user, req.files);
        res.json({
            success: true,
            message: "Place created (pending approval)",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// admin approve
const approvePlace = async (req, res) => {
    try {
        const result = await Place_service_1.PlaceService.approvePlace(req.params.id);
        res.json({
            success: true,
            message: "Place approved",
            data: result,
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
exports.placeController = {
    createPlace,
    approvePlace,
};
//# sourceMappingURL=Place.Controller.js.map