import { Request, Response } from "express";
import { PlaceService } from "./Place.service";
import { Place } from "./Place.model";
import mongoose from "mongoose";
import { ActivityService } from "../Activity/Activity.service";

const createPlace = async (req: any, res: Response) => {
    try {
        const files = req.files as any;

        const thumbnailCard = files?.thumbnailCard?.[0]?.path;
        const thumbnailDetails = files?.thumbnailDetails?.[0]?.path;

        const images =
            files?.images?.map((f: any) => f.path) || [];

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
            createdBy: new mongoose.Types.ObjectId(req.user.id),
            isActive: false,
        };

        // 🔥 CREATE PLACE
        const result = await Place.create(placeData);

        // =========================
        // 🔥 ADD ACTIVITY HERE
        // =========================
        await ActivityService.createActivity({
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

    } catch (err: any) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

//traveler get his places
const getMyPlaces = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        console.log("USER ID:", req.user.id);
        console.log("QUERY USER:", req.user.id);


        console.log("QUERY USER:", req.user.id);

        const places = await Place.find({
            createdBy: req.user.id,
        });

        console.log("FOUND PLACES:", places);

        res.json({
            success: true,
            data: places,
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getSinglePlace = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const place = await PlaceService.getSinglePlace(id);

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

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// GET ALL PLACES 
const getAllPlaces = async (req: any, res: Response) => {
    try {
        const places = await PlaceService.getAllPlaces();

        res.json({
            success: true,
            data: places,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// 🔥 APPROVE PLACE
const approvePlace = async (req: any, res: Response) => {
    try {
        const { id } = req.params;

        const updated = await PlaceService.approvePlace(id);

        res.json({
            success: true,
            message: "Place approved ✅",
            data: updated,
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};


export const placeController = {
    createPlace,
    getMyPlaces,
    getSinglePlace,
    getAllPlaces,
    approvePlace,
};