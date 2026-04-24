"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceService = void 0;
const Place_model_1 = require("./Place.model");
const createPlace = async (payload, user, files) => {
    if (user.role !== "traveler") {
        throw new Error("Only creators allowed");
    }
    const images = files?.images?.map((img) => img.path) || [];
    return await Place_model_1.Place.create({
        ...payload,
        thumbnailCard: files?.thumbnailCard?.[0]?.path,
        thumbnailDetails: files?.thumbnailDetails?.[0]?.path,
        images,
        createdBy: user.id,
    });
};
// admin approve
const approvePlace = async (id) => {
    const place = await Place_model_1.Place.findByIdAndUpdate(id, { isActive: true }, { new: true });
    return place;
};
exports.PlaceService = {
    createPlace,
    approvePlace,
};
//# sourceMappingURL=Place.service.js.map