import { Types } from "mongoose";
import { Blog } from "./Blog.model";

const createBlog = async (payload: any) => {
  return await Blog.create(payload);
};

const getAllBlogs = async () => {
  return await Blog.find()
    .populate("createdBy", "name role")
    .populate("places", "title thumbnailCard");
};

const getSingleBlog = async (id: string) => {
  return await Blog.findById(id)
    .populate("createdBy", "name")
    .populate("places", "title thumbnailCard location");
};

const getMyBlogs = async (userId: string) => {
  return await Blog.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .populate("places", "title thumbnailCard");
};

const toggleBlogStatus = async (id: string) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  blog.isActive = !blog.isActive;

  await blog.save();

  return blog;
};

// 🔹 SINGLE PLACE (for SinglePlace page)
const getBlogsByPlaceFromDB = async (placeId: string) => {
  return await Blog.find({
    places: { $in: [placeId] },
  })
    .populate("createdBy", "name")
    .select("title banner createdAt createdBy")
    .sort({ createdAt: -1 });
};

// 🔹 MULTIPLE PLACES (for SingleBlog related)
const getBlogsByPlacesFromDB = async (placeIds: string[]) => {
  return await Blog.find({
    places: {
      $in: placeIds.map((id) => new Types.ObjectId(id)),
    },
  })
    .populate("createdBy", "name")
    .select("title banner createdAt createdBy places")
    .sort({ createdAt: -1 });
};

const updateBlog = async (
  id: string,
  payload: any
) => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new Error("Blog not found");
  }

  // ✅ KEEP OLD IF NOT PROVIDED
  blog.title = payload.title || blog.title;
  blog.banner = payload.banner || blog.banner;
  blog.gallery = payload.gallery || blog.gallery;
  blog.sections = payload.sections || blog.sections;
  blog.places = payload.places || blog.places;

  await blog.save();

  return blog;
};


const getBlogsByAuthorService = async (authorId: string) => {
  return await Blog.find({ createdBy: authorId })
    .populate("createdBy", "name email image")
    .populate("places");
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getMyBlogs,
  toggleBlogStatus,
  getBlogsByPlaceFromDB,
  getBlogsByPlacesFromDB,
  updateBlog,
  getBlogsByAuthorService
};