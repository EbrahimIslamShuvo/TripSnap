"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeController = void 0;
const Place_service_1 = require("./Place.service");
const Place_model_1 = require("./Place.model");
const mongoose_1 = __importDefault(require("mongoose"));
const Activity_service_1 = require("../Activity/Activity.service");
const createPlace = async (req, res) => {
    try {
        const files = req.files;
        const thumbnailCard = files?.thumbnailCard?.[0]?.path;
        const thumbnailDetails = files?.thumbnailDetails?.[0]?.path;
        const images = files?.images?.map((f) => f.path) || [];
        if (!thumbnailCard || !thumbnailDetails) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail missing ❌",
            });
        }
        const placeData = {
            ...req.body,
            thumbnailCard,
            thumbnailDetails,
            images,
            createdBy: new mongoose_1.default.Types.ObjectId(req.user.id),
            isActive: false,
        };
        // 🔥 CREATE PLACE
        const result = await Place_model_1.Place.create(placeData);
        // =========================
        // 🔥 ADD ACTIVITY HERE
        // =========================
        await Activity_service_1.ActivityService.createActivity({
            user: req.user.id,
            type: "PLACE",
            message: `${req.user.name} added a place`,
            place: result._id,
        });
        // 🔥 RESPONSE
        res.json({
            success: true,
            message: "Place created ✅",
            data: result,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
//traveler get his places
const getMyPlaces = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("USER ID:", req.user.id);
        console.log("QUERY USER:", req.user.id);
        console.log("QUERY USER:", req.user.id);
        const places = await Place_model_1.Place.find({
            createdBy: req.user.id,
        });
        console.log("FOUND PLACES:", places);
        res.json({
            success: true,
            data: places,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
const getSinglePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place_service_1.PlaceService.getSinglePlace(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place not found",
            });
        }
        res.json({
            success: true,
            data: place,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
// GET ALL PLACES 
const getAllPlaces = async (req, res) => {
    try {
        const places = await Place_service_1.PlaceService.getAllPlaces();
        res.json({
            success: true,
            data: places,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
// 🔥 APPROVE PLACE
const approvePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Place_service_1.PlaceService.approvePlace(id);
        res.json({
            success: true,
            message: "Place approved ✅",
            data: updated,
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
    getMyPlaces,
    getSinglePlace,
    getAllPlaces,
    approvePlace,
};
//# sourceMappingURL=Place.Controller.js.map