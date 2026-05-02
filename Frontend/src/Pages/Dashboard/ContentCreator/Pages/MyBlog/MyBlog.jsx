import React, { useEffect, useState } from "react";
import BlogCard from "../../../../../Component/Card/BlogCard";

const API = "http://localhost:3000/api/blogs";

const MyBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (data.success) {
          setBlogs(data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-semibold mb-6">
        My Blogs
      </h2>

      {/* EMPTY STATE */}
      {blogs.length === 0 ? (
        <div className="text-center text-gray-500">
          No blogs yet 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}

    </div>
  );
};

export default MyBlog;