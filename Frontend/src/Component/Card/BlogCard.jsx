import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

const BlogCard = ({ blog }) => {

  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  return (
    <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer">

      {/* IMAGE */}
      <img
        src={imageUrl(blog.banner)}
        alt={blog.title}
        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* TOP BADGE */}
      <div className="absolute top-3 left-3 bg-[#32AEBB]/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
        Travel Blog
      </div>

      {/* CONTENT */}
      <div className="absolute bottom-0 p-4 text-white w-full space-y-2">

        {/* TITLE */}
        <NavLink
          to={`/tripsnap/blog/${blog._id}`}
          className="text-lg font-semibold leading-tight block group-hover:underline"
        >
          {blog.title}
        </NavLink>

        {/* META */}
        <div className="flex items-center justify-between text-xs text-gray-300">

          <div className="flex items-center gap-1">
            <FaUserCircle />
            {blog.createdBy?.name || "You"}
          </div>

          <div className="flex items-center gap-1">
            <HiOutlineClock />
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>

        </div>

        {/* HIDDEN DESCRIPTION (HOVER) */}
        <p className="text-sm text-gray-200 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
          {blog.sections?.[0]?.content?.slice(0, 80) || "Click to read more..."}
        </p>

      </div>

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#32AEBB] transition pointer-events-none"></div>

    </div>
  );
};

export default BlogCard;