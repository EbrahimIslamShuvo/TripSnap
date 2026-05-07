import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBookmark,
  FaRegBookmark,
  FaImage,
} from "react-icons/fa";

import BlogCard from "../../../Component/Card/BlogCard";

const API = "http://localhost:3000/api/places";

const SinglePlace = () => {

  const { id } = useParams();

  const [place, setPlace] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(true);

  // 🔥 SAVE
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🔥 COMMENTS
  const [comments, setComments] = useState([]);

  const [comment, setComment] =
    useState("");

  const [commentImage, setCommentImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [commentLoading, setCommentLoading] =
    useState(false);

  // 🔥 USER
  const user = JSON.parse(
    localStorage.getItem("user") ||
    "null"
  );

  // ================= FETCH =================
  useEffect(() => {

    const fetchData = async () => {

      try {

        const [placeRes, blogRes] =
          await Promise.all([

            fetch(`${API}/${id}`),

            fetch(
              `http://localhost:3000/api/blogs/by-place/${id}`
            ),

          ]);

        const placeData =
          await placeRes.json();

        const blogData =
          await blogRes.json();

        // 🔥 PLACE
        if (placeData.success) {
          setPlace(placeData.data);
        }

        // 🔥 BLOGS
        if (blogData.success) {

          const activeBlogs =
            (blogData.data || []).filter(
              (b) =>
                b.isActive !== false
            );

          // 🔥 BLOG LIMIT
          let limitedBlogs =
            activeBlogs;

          // FREE + EXPIRED
          if (
            user?.subscription?.status ===
            "free" ||
            user?.subscription?.status ===
            "expired"
          ) {

            limitedBlogs =
              activeBlogs.slice(0, 1);
          }

          setBlogs(limitedBlogs);
        }

        // 🔥 CHECK SAVED
        if (user?._id) {

          const userRes = await fetch(
            `http://localhost:3000/api/users/${user._id}`
          );

          const userData =
            await userRes.json();

          if (userData.success) {

            const savedPlaces =
              userData.data.savedPlaces || [];

            const isSaved =
              savedPlaces.some(
                (p) =>
                  String(p._id) ===
                  String(id)
              );

            setSaved(isSaved);
          }
        }

        fetchComments();

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

  // ================= FETCH COMMENTS =================
  const fetchComments = async () => {

    try {

      const res = await fetch(
        `http://localhost:3000/api/comments/place/${id}`
      );

      const data =
        await res.json();

      if (data.success) {
        setComments(data.data);
      }

    } catch (err) {

      console.log(err);

    }
  };

  // ================= COMMENT =================
  const handleComment = async () => {

    try {

      if (!comment) return;

      setCommentLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const fd = new FormData();

      fd.append("text", comment);

      fd.append("place", id);

      if (commentImage) {
        fd.append(
          "image",
          commentImage
        );
      }

      const res = await fetch(
        "http://localhost:3000/api/comments/create",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: fd,
        }
      );

      const data =
        await res.json();

      if (data.success) {

        setComment("");

        setCommentImage(null);

        setPreview(null);

        fetchComments();
      }

    } catch (err) {

      console.log(err);

    } finally {

      setCommentLoading(false);

    }
  };

  // ================= SAVE PLACE =================
  const handleSavePlace = async () => {

    try {

      setSaving(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        `http://localhost:3000/api/users/save-place/${id}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      if (data.success) {
        setSaved(data.saved);
      }

    } catch (err) {

      console.log(err);

    } finally {

      setSaving(false);

    }
  };

  // ================= IMAGE =================
  const imageUrl = (img) => {

    if (!img) {
      return "https://via.placeholder.com/400";
    }

    const clean =
      img.replace(/\\/g, "/");

    if (clean.startsWith("http")) {
      return clean;
    }

    return `http://localhost:3000/${clean.replace(
      /^\/?/,
      ""
    )}`;
  };

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  // ================= NOT FOUND =================
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
          src={imageUrl(
            place.thumbnailDetails
          )}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        {/* HERO CONTENT */}
        <div className="absolute inset-0 flex items-end mb-25 px-4">

          <div className="w-full max-w-6xl mx-auto">

            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 text-white shadow-xl">

              <div className="flex justify-between items-start gap-4">

                {/* LEFT */}
                <div>

                  <h1 className="text-4xl md:text-5xl mb-5 font-bold">
                    {place.title}
                  </h1>

                  <p className="text-gray-200">
                    📍 {place.location},{" "}
                    {place.country}
                  </p>

                </div>

                {/* RIGHT */}
                {user?.role ===
                  "user" && (

                    <button
                      onClick={
                        handleSavePlace
                      }
                      disabled={saving}
                      className={`
                    flex items-center gap-2 px-5 py-2 rounded-full
                    transition-all duration-300 shadow-lg font-medium
                    ${saved
                          ? "bg-[#32AEBB] text-white"
                          : "bg-white text-black hover:bg-gray-100"
                        }
                  `}
                    >

                      {saved ? (
                        <>
                          <FaBookmark className="text-lg" />
                          <span>
                            Saved
                          </span>
                        </>
                      ) : (
                        <>
                          <FaRegBookmark className="text-lg" />
                          <span>
                            Save
                          </span>
                        </>
                      )}

                    </button>

                  )}

              </div>

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

            {place.images?.map(
              (img, i) => (

                <div
                  key={i}
                  className="overflow-hidden rounded-xl group"
                >

                  <img
                    src={imageUrl(img)}
                    className="h-40 w-full object-cover group-hover:scale-110 transition duration-500"
                  />

                </div>

              )
            )}

          </div>

        </div>

        {/* RELATED BLOGS */}
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

                <BlogCard
                  key={blog._id}
                  blog={blog}
                />

              ))}

            </div>

          )}

        </div>

        {/* COMMENTS */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">

          <h2 className="text-xl font-semibold mb-6">
            Comments ({comments.length})
          </h2>

          {/* ADD COMMENT */}
          {user?.role === "user" &&
            user?.subscription?.plan !== "free" &&
            user?.subscription?.plan !== "expired" ? (

            <div className="mb-8">

              <div className="flex gap-3 items-start">

                {/* USER IMAGE */}
                <img
                  src={
                    user?.image
                      ? `http://localhost:3000/${user.image}`
                      : "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  className="w-12 h-12 rounded-full object-cover border"
                />

                {/* INPUT AREA */}
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">

                  <textarea
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    className="w-full bg-transparent outline-none resize-none min-h-[70px]"
                  />

                  {/* PREVIEW */}
                  {preview && (

                    <div className="mt-3 relative w-fit">

                      <img
                        src={preview}
                        className="w-28 h-28 object-cover rounded-xl"
                      />

                      <button
                        onClick={() => {
                          setPreview(null);
                          setCommentImage(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                      >
                        ✕
                      </button>

                    </div>

                  )}

                  {/* ACTION */}
                  <div className="flex justify-between items-center mt-3">

                    {/* IMAGE */}
                    <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#32AEBB] transition">

                      <FaImage className="text-lg" />

                      <span className="text-sm">
                        Add Image
                      </span>

                      <input
                        type="file"
                        hidden
                        onChange={(e) => {

                          const file =
                            e.target.files[0];

                          if (!file) return;

                          setCommentImage(file);

                          setPreview(
                            URL.createObjectURL(file)
                          );
                        }}
                      />

                    </label>

                    {/* POST */}
                    <button
                      onClick={handleComment}
                      disabled={commentLoading}
                      className="w-11 h-11 rounded-full bg-[#32AEBB] text-white flex items-center justify-center hover:scale-105 transition"
                    >

                      {commentLoading ? (

                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                      ) : (

                        <span className="text-xl">
                          ➜
                        </span>

                      )}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="mb-8">

              <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] rounded-3xl p-8 text-white text-center shadow-xl">

                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">

                  <FaRegBookmark className="text-3xl" />

                </div>

                <h2 className="text-3xl font-bold">
                  Premium Required ✨
                </h2>

                <p className="mt-3 text-white/80 max-w-2xl mx-auto leading-relaxed">

                  Upgrade your subscription to unlock comments, unlimited places and premium travel features.

                </p>

                <button
                  onClick={() =>
                    window.location.href =
                    "/dashboard/user/subscription"
                  }
                  className="mt-6 px-8 py-3 bg-white text-[#000080] rounded-full font-bold hover:scale-105 transition-all"
                >

                  Upgrade Now

                </button>

              </div>

            </div>

          )}

          {/* COMMENT LIST */}
          <div className="space-y-5">

            {comments.length === 0 ? (

              <p className="text-gray-500">
                No comments yet 😢
              </p>

            ) : (

              comments.map((c) => (

                <div
                  key={c._id}
                  className="border rounded-2xl p-4"
                >

                  <div className="flex items-start gap-3">

                    {/* IMAGE */}
                    <img
                      src={
                        c.user?.image
                          ? `http://localhost:3000/${c.user.image}`
                          : "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* CONTENT */}
                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <div>

                          <h3 className="font-semibold">
                            {c.user?.name}
                          </h3>

                          <p className="text-xs text-gray-400">
                            {new Date(
                              c.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>

                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {c.text}
                      </p>

                      {c.image && (

                        <img
                          src={`http://localhost:3000/${c.image}`}
                          className="mt-4 rounded-2xl max-h-80 object-cover"
                        />

                      )}

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default SinglePlace;