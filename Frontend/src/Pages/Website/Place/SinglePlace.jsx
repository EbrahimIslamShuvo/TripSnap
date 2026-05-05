import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../../../Component/Card/BlogCard";

const API = "http://localhost:3000/api/places";

const SinglePlace = () => {
  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);

  // 🔥 SINGLE CLEAN useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [placeRes, blogRes] = await Promise.all([
          fetch(`${API}/${id}`),
          fetch(`http://localhost:3000/api/blogs/by-place/${id}`),
        ]);

        const placeData = await placeRes.json();
        const blogData = await blogRes.json();

        if (placeData.success) {
          setPlace(placeData.data);
        }

        if (blogData.success) {
          setBlogs(blogData.data);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        setBlogLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // 🔥 IMAGE FIX
  const imageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400";

    const clean = img.replace(/\\/g, "/");

    if (clean.startsWith("http")) return clean;

    return `http://localhost:3000/${clean.replace(/^\/?/, "")}`;
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!place) {
    return (
      <div className="p-6 text-center text-gray-500">
        Place not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={imageUrl(place.thumbnailDetails)}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex items-end mb-25 px-4">
          <div className="w-full max-w-6xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl">

              <h1 className="text-4xl md:text-5xl mb-5 font-bold">
                {place.title}
              </h1>

              <p className="mt-2 text-gray-200">
                📍 {place.location}, {place.country}
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 space-y-8 -mt-16 relative z-10">

        {/* DESCRIPTION */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-3">
            About this place
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* GALLERY */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {place.images?.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl group"
              >
                <img
                  src={imageUrl(img)}
                  className="h-40 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 RELATED BLOGS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Related Blogs
          </h2>

          {blogLoading ? (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-gray-500">
              No blogs available for this place
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SinglePlace;