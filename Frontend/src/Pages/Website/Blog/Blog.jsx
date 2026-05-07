import React, { useEffect, useState } from "react";
import BlogCard from "../../../Component/Card/BlogCard";
import { FaLock } from "react-icons/fa";

const API = "http://localhost:3000/api/blogs";

const Blog = () => {

  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // 🔥 USER
  const user = JSON.parse(
    localStorage.getItem("user") ||
    "null"
  );

  // 🔥 SUBSCRIPTION
  const currentPlan =
    user?.subscription?.plan ||
    "free";

  // ================= FETCH =================
  useEffect(() => {

    const fetchBlogs = async () => {

      try {

        const res = await fetch(
          `${API}/all`
        );

        const data =
          await res.json();

        if (data.success) {

          // 🔥 ACTIVE + SORT
          let activeSorted =
            (data.data || [])
              .filter(
                (b) =>
                  b.isActive === true
              )
              .sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ) -
                  new Date(
                    a.createdAt
                  )
              );

          // 🔥 FREE = 3 BLOG
          if (
            currentPlan ===
            "free"
          ) {

            activeSorted =
              activeSorted.slice(
                0,
                3
              );
          }

          // 🔥 EXPIRED = 5 BLOG
          else if (
            currentPlan ===
            "expired"
          ) {

            activeSorted =
              activeSorted.slice(
                0,
                5
              );
          }

          // 🔥 PREMIUM = ALL
          setBlogs(activeSorted);

          setFiltered(
            activeSorted
          );
        }

      } catch (err) {

        console.log(
          "FETCH ERROR:",
          err
        );

      } finally {

        setLoading(false);

      }
    };

    fetchBlogs();

  }, [currentPlan]);

  // ================= FILTER =================
  useEffect(() => {

    let temp = [...blogs];

    if (search) {

      temp = temp.filter(
        (b) =>
          (b.title || "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    setFiltered(temp);

  }, [search, blogs]);

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Explore Blogs ✍️
          </h1>

          <p className="text-gray-500 mt-1">
            Discover travel stories from creators
          </p>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search blog..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="input max-w-[300px]"
        />

      </div>

      {/* 🔥 CONTENT */}
      {loading ? (

        <div className="flex justify-center py-20">

          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : filtered.length === 0 ? (

        <p className="text-center text-gray-500">
          No blogs found 😢
        </p>

      ) : (

        <>
          {/* BLOG GRID */}
          <div className="grid md:grid-cols-3 gap-5">

            {filtered.map((blog) => (

              <BlogCard
                key={blog._id}
                blog={blog}
              />

            ))}

          </div>

          {/* 🔥 LOCK CARD */}
          {(currentPlan ===
            "free" ||

            currentPlan ===
            "expired") && (

              <div className="mt-12">

                <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] rounded-3xl p-8 text-white text-center shadow-xl">

                  {/* ICON */}
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">

                    <FaLock className="text-3xl" />

                  </div>

                  {/* TITLE */}
                  <h2 className="text-3xl font-bold">
                    Unlock All Blogs 🔓
                  </h2>

                  {/* TEXT */}
                  <p className="mt-3 text-white/80 max-w-2xl mx-auto leading-relaxed">

                    {currentPlan ===
                    "free"
                      ? "Free users can access only 3 blogs."
                      : "Expired users can access only 5 blogs."}

                    {" "}
                    Upgrade your subscription to unlock unlimited blogs, comment access and premium travel features.

                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      window.location.href =
                      "/dashboard/user/subscription"
                    }
                    className="mt-6 px-8 py-3 bg-white text-[#000080] rounded-full font-bold hover:scale-105 transition-all duration-300"
                  >

                    Upgrade Now

                  </button>

                </div>

              </div>

            )}

        </>
      )}

      {/* STYLE */}
      <style>{`
        .input {
          border: 1px solid #ddd;
          padding: 12px 14px;
          border-radius: 14px;
          outline: none;
          width: 100%;
          background: white;
        }

        .input:focus {
          border-color: #32AEBB;
        }
      `}</style>

    </div>
  );
};

export default Blog;