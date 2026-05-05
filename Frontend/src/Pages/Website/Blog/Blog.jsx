import React, { useEffect, useState } from "react";
import BlogCard from "../../../Component/Card/BlogCard";

const API = "http://localhost:3000/api/blogs";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API}/all`);
        const data = await res.json();

        console.log("BLOG RESPONSE:", data);

        if (data.success) {
          // 🔥 ONLY ACTIVE + SORT
          const activeSorted = (data.data || [])
            .filter((b) => b.isActive === true)
            .sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

          setBlogs(activeSorted);
          setFiltered(activeSorted);
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    let temp = [...blogs];

    if (search) {
      temp = temp.filter((b) =>
        (b.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [search, blogs]);

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* 🔥 TITLE + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <h1 className="text-2xl font-bold">Explore Blogs ✍️</h1>

        <input
          type="text"
          placeholder="Search blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input max-w-70"
        />
      </div>

      {/* 🔥 CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found 😢</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {filtered.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

      {/* STYLE */}
      <style>{`
        .input {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 6px;
          outline: none;
          width: 100%;
        }
      `}</style>

    </div>
  );
};

export default Blog;