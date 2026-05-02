import React from "react";
import { NavLink } from "react-router-dom";

const BlogCard = ({ blog }) => {

  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  return (
    <div className="group relative h-60 rounded-xl overflow-hidden shadow-lg cursor-pointer">

      {/* IMAGE */}
      <img
        src={imageUrl(blog.banner)}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* CONTENT */}
      <div className="absolute bottom-0 p-4 text-white w-full">

        <NavLink
          to={`/tripsnap/blog/${blog._id}`}
          className="text-lg font-semibold leading-tight block"
        >
          {blog.title}
        </NavLink>

        <p className="text-sm text-gray-300 mt-1">
          ✍️ {blog.createdBy?.name || "You"}
        </p>

      </div>

      {/* HOVER BORDER */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/10 group-hover:border-white/40 transition pointer-events-none"></div>

    </div>
  );
};

export default BlogCard;