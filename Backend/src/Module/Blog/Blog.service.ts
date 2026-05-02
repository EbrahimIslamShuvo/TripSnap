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

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  getMyBlogs,
  toggleBlogStatus
};