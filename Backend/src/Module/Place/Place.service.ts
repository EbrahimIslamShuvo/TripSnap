import { Place } from "./Place.model";

const createPlace = async (payload: any) => {
  return await Place.create(payload);
};

const getMyPlaces = async (userId: string) => {
  return await Place.find({ createdBy: userId }).sort({ createdAt: -1 });
};

const approvePlace = async (id: string) => {
  return await Place.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );
};

const getSinglePlace = async (id: string) => {
  return await Place.findById(id);
};

// 🔥 GET ALL (ADMIN)
const getAllPlaces = async () => {
  return await Place.find().sort({ createdAt: -1 });
};



export const PlaceService = {
  createPlace,
  getMyPlaces,
  approvePlace,
  getSinglePlace,
  getAllPlaces,
};