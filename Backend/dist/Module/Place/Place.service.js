"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceService = void 0;
const Place_model_1 = require("./Place.model");
const createPlace = async (payload) => {
    return await Place_model_1.Place.create(payload);
};
const getMyPlaces = async (userId) => {
    return await Place_model_1.Place.find({ createdBy: userId }).sort({ createdAt: -1 });
};
const approvePlace = async (id) => {
    return await Place_model_1.Place.findByIdAndUpdate(id, { isActive: true }, { new: true });
};
const getSinglePlace = async (id) => {
    return await Place_model_1.Place.findById(id);
};
// 🔥 GET ALL 
const getAllPlaces = async () => {
    return await Place_model_1.Place.find().sort({ createdAt: -1 });
};
exports.PlaceService = {
    createPlace,
    getMyPlaces,
    approvePlace,
    getSinglePlace,
    getAllPlaces,
};
//# sourceMappingURL=Place.service.js.map