import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../../../Component/Card/BlogCard";
import UserCardPlace from "../../../Component/Card/UserCardPlace";

const API = "http://localhost:3000/api/blogs";

const SingleBlog = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedPlaces, setRelatedPlaces] = useState([]);

  // ✅ SAFE USER LOAD
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.log("User parse error:", err);
    user = null;
  }

  // ✅ 🔥 FINAL AUTHOR CHECK (STRING FIX)
  const isAuthor = Boolean(
    user &&
    blog &&
    String(user._id) === String(blog.createdBy?._id || blog.createdBy)
  );

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        if (data.success) {
          setBlog(data.data);
          fetchRelated(data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (blogData) => {
      try {
        if (!blogData.places || blogData.places.length === 0) return;

        // 🔥 RELATED PLACES
        setRelatedPlaces(blogData.places);

        // 🔥 RELATED BLOGS
        const res = await fetch(
          "http://localhost:3000/api/blogs/by-places",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              placeIds: blogData.places.map((p) => p._id),
            }),
          }
        );

        const data = await res.json();

        if (data.success) {
          const unique = Array.from(
            new Map(
              data.data
                .filter((b) => b._id !== blogData._id)
                .map((b) => [b._id, b])
            ).values()
          );

          setRelatedBlogs(unique);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  // 🔥 TOGGLE STATUS
  const toggleStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/blogs/toggle/${blog._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setBlog((prev) => ({
          ...prev,
          isActive: data.data.isActive,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  // 🔄 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ❌ NOT FOUND
  if (!blog) {
    return (
      <div className="text-center p-10 text-gray-500">
        Blog not found 😢
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HERO */}
      <div className="relative h-[350px] md:h-[450px]">
        <img
          src={imageUrl(blog.banner)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* TITLE CARD */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-6 border border-white/40">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {blog.title}
          </h1>

          <p className="mt-2 text-gray-600">
            ✍️{" "}
            <span
              onClick={() =>
                window.location.href = `/tripsnap/users/${blog.createdBy?._id || blog.createdBy}`
              }
              className="cursor-pointer text-blue-600 hover:underline"
            >
              {blog.createdBy?.name || "Unknown"}
            </span>
          </p>

          {/* 🔥 AUTHOR CONTROLS (NOW WILL SHOW) */}
          {isAuthor && (
            <div className="mt-4 flex gap-3">

              <button
                onClick={toggleStatus}
                className={`px-4 py-1 rounded-full text-sm font-medium ${blog.isActive
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
                  }`}
              >
                {blog.isActive ? "Active" : "Inactive"}
              </button>

              <button
                onClick={() =>
                  (window.location.href = `/dashboard/creator/edit-blog/${blog._id}`)
                }
                className="px-4 py-1 rounded-full bg-blue-500 text-white text-sm"
              >
                Edit
              </button>

            </div>
          )}

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* SECTIONS */}
        {blog.sections?.map((sec, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow space-y-3">

            {sec.type === "text" && (
              <>
                <h2 className="text-xl font-semibold">{sec.title}</h2>
                <p className="text-gray-600">{sec.content}</p>
              </>
            )}

            {sec.type === "image" && (
              <img src={imageUrl(sec.image)} className="w-full rounded-lg" />
            )}

            {sec.type === "table" && (
              <div>
                <h2 className="font-semibold mb-2">{sec.table?.title}</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-max border w-full">
                    <thead>
                      <tr>
                        {sec.table?.columns?.map((col, idx) => (
                          <th key={idx} className="border p-2 bg-gray-100">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sec.table?.rows?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="border p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        ))}

        {/* GALLERY */}
        {blog.gallery?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blog.gallery.map((img, i) => (
                <img
                  key={i}
                  src={imageUrl(img)}
                  className="h-40 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* RELATED PLACES */}
        {relatedPlaces.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Related Places</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {relatedPlaces.slice(0, 6).map((p) => (
                <UserCardPlace key={p._id} place={p} />
              ))}
            </div>
          </div>
        )}

        {/* RELATED BLOGS */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Related Blogs</h2>

            <div className="grid md:grid-cols-3 gap-5">
              {relatedBlogs.slice(0, 6).map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SingleBlog;