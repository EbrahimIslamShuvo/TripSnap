import React, { useEffect, useState } from "react";
import BlogCard from "../../../../../Component/Card/BlogCard";

const SavedBlog = () => {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ================= FETCH =================
  useEffect(() => {

    const fetchSavedBlogs = async () => {

      try {

        if (!user?._id) {
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:3000/api/users/${user._id}`
        );

        const data = await res.json();

        console.log("SAVED BLOGS:", data);

        if (data.success) {

          const savedBlogs =
            data.data.savedBlogs || [];

          // 🔥 LATEST FIRST
          setBlogs(
            [...savedBlogs].reverse()
          );
        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchSavedBlogs();

  }, []);

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Saved Blogs
        </h1>

        <p className="text-gray-500 mt-2">
          Your bookmarked travel stories ✍️
        </p>

      </div>

      {/* EMPTY */}
      {blogs.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <h2 className="text-xl font-semibold text-gray-700">
            No saved blogs yet 😢
          </h2>

          <p className="text-gray-500 mt-2">
            Save your favorite blogs to see them here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {blogs.map((blog) => (

            <BlogCard
              key={blog._id}
              blog={blog}
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default SavedBlog;