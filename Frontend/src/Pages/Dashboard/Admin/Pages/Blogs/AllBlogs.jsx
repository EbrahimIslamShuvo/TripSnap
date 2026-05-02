import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const API = "http://localhost:3000/api/blogs";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  };

  // 🔥 FETCH ALL BLOGS
  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        setBlogs(data.data);
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to load blogs ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 🔥 TOGGLE ACTIVE / INACTIVE
  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/toggle/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message, "error");

      // 🔥 UPDATE UI
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, isActive: !b.isActive } : b
        )
      );

      showToast("Status updated ✅");

    } catch (err) {
      console.log(err);
      showToast("Error ❌", "error");
    }
  };

  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">

      {/* 🔥 TOAST */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 w-80 animate-slide">
          <div
            className={`px-4 py-3 rounded-lg shadow text-white
            ${toast.type === "success" ? "bg-[#32AEBB]" : "bg-[#F48C3C]"}`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-6">
        All Blogs (Admin)
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="group relative rounded-xl overflow-hidden shadow-lg"
          >

            {/* IMAGE */}
            <img
              src={imageUrl(blog.banner)}
              className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* STATUS TOGGLE */}
            <button
              onClick={() => toggleStatus(blog._id)}
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium
              ${
                blog.isActive
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {blog.isActive ? "Active" : "Inactive"}
            </button>

            {/* CONTENT */}
            <div className="absolute bottom-0 p-4 text-white w-full">

              <NavLink to={`/tripsnap/blog/${blog._id}`} className="font-semibold">
                {blog.title}
              </NavLink>

              <p className="text-sm text-gray-300">
                ✍️ {blog.createdBy?.name || "Unknown"}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* STYLE */}
      <style>{`
        @keyframes slide {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide {
          animation: slide 0.3s ease;
        }
      `}</style>

    </div>
  );
};

export default AllBlogs;