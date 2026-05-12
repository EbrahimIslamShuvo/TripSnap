import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FaBookmark,
  FaRegBookmark,
  FaImage,
} from "react-icons/fa";

import BlogCard from "../../../Component/Card/BlogCard";
import UserCardPlace from "../../../Component/Card/UserCardPlace";

const API = "http://localhost:3000/api/blogs";

const SingleBlog = () => {

  const { id } = useParams();

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [relatedBlogs, setRelatedBlogs] =
    useState([]);

  const [relatedPlaces, setRelatedPlaces] =
    useState([]);

  // 🔥 SAVE
  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  // 🔥 COMMENTS
  const [comments, setComments] =
    useState([]);

  const [comment, setComment] =
    useState("");

  const [commentImage, setCommentImage] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [commentLoading, setCommentLoading] =
    useState(false);

  // ✅ USER
  // ✅ USER
  const [user, setUser] =
    useState(null);

  // ================= USER LOAD =================
  useEffect(() => {

    const loadUser =
      async () => {

        try {

          const storedUser =
            localStorage.getItem(
              "user"
            );

          if (
            !storedUser ||
            storedUser ===
            "undefined"
          ) {
            return;
          }

          const parsedUser =
            JSON.parse(
              storedUser
            );

          // 🔥 GET UPDATED USER
          const res =
            await fetch(
              `http://localhost:3000/api/users/${parsedUser._id}`
            );

          const data =
            await res.json();

          if (
            data.success
          ) {

            localStorage.setItem(
              "user",
              JSON.stringify(
                data.data
              )
            );

            setUser(
              data.data
            );

          } else {

            setUser(
              parsedUser
            );
          }

        } catch (err) {

          console.log(err);

        }
      };

    loadUser();

  }, []);

  // 🔥 AUTHOR CHECK
  const isAuthor = Boolean(
    user &&
    blog &&
    String(user._id) ===
    String(
      blog.createdBy?._id ||
      blog.createdBy
    )
  );

  // ================= FETCH =================
  useEffect(() => {

    const fetchBlog = async () => {

      try {

        const res = await fetch(
          `${API}/${id}`
        );

        const data = await res.json();

        if (data.success) {

          setBlog(data.data);

          fetchRelated(data.data);

          // 🔥 CHECK SAVED
          if (user?._id) {

            const userRes = await fetch(
              `http://localhost:3000/api/users/${user._id}`
            );

            const userData =
              await userRes.json();

            if (userData.success) {

              const savedBlogs =
                userData.data.savedBlogs || [];

              const isSaved =
                savedBlogs.some(
                  (b) =>
                    String(b._id) ===
                    String(id)
                );

              setSaved(isSaved);
            }
          }

          fetchComments();
        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    // ================= RELATED =================
    const fetchRelated = async (
      blogData
    ) => {

      try {

        if (
          !blogData.places ||
          blogData.places.length === 0
        ) return;

        // 🔥 PLACES
        // 🔥 PLACE LIMIT
        let limitedPlaces =
          blogData.places;

        if (
          !user?.subscription?.plan ||
          user?.subscription?.plan ===
          "free"
        ) {

          limitedPlaces =
            blogData.places.slice(
              0,
              3
            );
        }

        setRelatedPlaces(
          limitedPlaces
        );

        // 🔥 BLOGS
        const res = await fetch(
          "http://localhost:3000/api/blogs/by-places",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              placeIds:
                blogData.places.map(
                  (p) => p._id
                ),
            }),
          }
        );

        const data =
          await res.json();

        if (data.success) {

          const unique =
            Array.from(
              new Map(
                data.data
                  .filter(
                    (b) =>
                      b._id !==
                      blogData._id
                  )
                  .filter(
                    (b) =>
                      b.isActive !== false
                  )
                  .map((b) => [
                    b._id,
                    b,
                  ])
              ).values()
            );

          // 🔥 BLOG LIMIT
          let limitedBlogs =
            unique;

          // FREE + EXPIRED
          if (
            !user?.subscription?.plan ||
            user?.subscription?.plan ===
            "free"
          ) {

            limitedBlogs =
              unique.slice(0, 1);
          }

          setRelatedBlogs(
            limitedBlogs
          );
        }

      } catch (err) {

        console.log(err);

      }
    };

    fetchBlog();

    window.scrollTo(0, 0);

  }, [id]);

  // ================= FETCH COMMENTS =================
  const fetchComments = async () => {

    try {

      const res = await fetch(
        `http://localhost:3000/api/comments/blog/${id}`
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

      fd.append("blog", id);

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

  // ================= SAVE BLOG =================
  const handleSaveBlog = async () => {

    try {

      setSaving(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        `http://localhost:3000/api/users/save-blog/${blog._id}`,
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

  // ================= TOGGLE =================
  const toggleStatus = async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        `http://localhost:3000/api/blogs/toggle/${blog._id}`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      if (data.success) {

        setBlog((prev) => ({
          ...prev,
          isActive:
            data.data.isActive,
        }));
      }

    } catch (err) {

      console.log(err);

    }
  };

  // ================= IMAGE =================
  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="min-h-screen flex justify-center items-center">

        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  // ================= NOT FOUND =================
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

      {/* TITLE */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">

        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-6 border border-white/40">

          <div className="flex justify-between items-start gap-4">

            {/* LEFT */}
            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {blog.title}
              </h1>

              <p className="mt-2 text-gray-600">
                ✍️{" "}

                <span
                  onClick={() =>
                    window.location.href =
                    `/tripsnap/users/${blog.createdBy?._id || blog.createdBy}`
                  }
                  className="cursor-pointer text-blue-600 hover:underline"
                >
                  {blog.createdBy?.name ||
                    "Unknown"}
                </span>

              </p>

            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">

              {/* SAVE */}
              {user?.role === "user" && (

                <button
                  onClick={
                    handleSaveBlog
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
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <FaRegBookmark className="text-lg" />
                      <span>Save</span>
                    </>
                  )}

                </button>

              )}

              {/* AUTHOR */}
              {isAuthor && (

                <>
                  <button
                    onClick={
                      toggleStatus
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium ${blog.isActive
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-black"
                      }`}
                  >
                    {blog.isActive
                      ? "Active"
                      : "Inactive"}
                  </button>

                  <button
                    onClick={() =>
                    (window.location.href =
                      `/dashboard/traveler/edit-blog/${blog._id}`)
                    }
                    className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm"
                  >
                    Edit
                  </button>
                </>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* SECTIONS */}
        {blog.sections?.map(
          (sec, i) => (

            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow space-y-3"
            >

              {sec.type ===
                "text" && (
                  <>
                    <h2 className="text-xl font-semibold">
                      {sec.title}
                    </h2>

                    <p className="text-gray-600">
                      {sec.content}
                    </p>
                  </>
                )}

              {sec.type ===
                "image" && (
                  <img
                    src={imageUrl(
                      sec.image
                    )}
                    className="w-full rounded-lg"
                  />
                )}

              {sec.type ===
                "table" && (
                  <div>

                    <h2 className="font-semibold mb-2">
                      {
                        sec.table
                          ?.title
                      }
                    </h2>

                    <div className="overflow-x-auto">

                      <table className="min-w-max border w-full">

                        <thead>
                          <tr>
                            {sec.table?.columns?.map(
                              (
                                col,
                                idx
                              ) => (
                                <th
                                  key={
                                    idx
                                  }
                                  className="border p-2 bg-gray-100"
                                >
                                  {
                                    col
                                  }
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {sec.table?.rows?.map(
                            (
                              row,
                              rIdx
                            ) => (
                              <tr
                                key={
                                  rIdx
                                }
                              >
                                {row.map(
                                  (
                                    cell,
                                    cIdx
                                  ) => (
                                    <td
                                      key={
                                        cIdx
                                      }
                                      className="border p-2"
                                    >
                                      {
                                        cell
                                      }
                                    </td>
                                  )
                                )}
                              </tr>
                            )
                          )}
                        </tbody>

                      </table>

                    </div>

                  </div>
                )}

            </div>

          )
        )}

        {/* GALLERY */}
        {blog.gallery?.length >
          0 && (

            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-4">
                Gallery
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                {blog.gallery.map(
                  (img, i) => (

                    <img
                      key={i}
                      src={imageUrl(
                        img
                      )}
                      className="h-40 w-full object-cover rounded-lg"
                    />

                  )
                )}

              </div>

            </div>

          )}

        {/* RELATED PLACES */}
        {relatedPlaces.length > 0 && (

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-gray-800">
                Related Places
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                Discover destinations connected to this blog
              </p>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

              {relatedPlaces
                .slice(0, 6)
                .map((p) => (

                  <UserCardPlace
                    key={p._id}
                    place={p}
                  />

                ))}

            </div>

          </div>

        )}

        {/* RELATED BLOGS */}
        {relatedBlogs.length > 0 && (

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Related Blogs
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  Explore similar travel stories
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {relatedBlogs
                .slice(0, 6)
                .map((b) => (

                  <BlogCard
                    key={b._id}
                    blog={b}
                  />

                ))}

            </div>

          </div>

        )}

        {/* COMMENTS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Comments
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {comments.length} people shared their thoughts
              </p>

            </div>

          </div>

          {/* ADD COMMENT */}
          {/* ADD COMMENT */}
          {user?.role === "user" &&
            user?.subscription?.plan !== "free" ? (

            <div className="mb-10">

              <div className="flex gap-4 items-start">

                {/* USER IMAGE */}
                <img
                  src={
                    user?.image
                      ? `http://localhost:3000/${user.image}`
                      : "https://i.ibb.co/4pDNDk1/avatar.png"
                  }
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />

                {/* INPUT */}
                <div className="flex-1 bg-[#F7F9FA] rounded-3xl px-5 py-4 border border-gray-200">

                  <textarea
                    placeholder="Share your thoughts about this blog..."
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    className="w-full bg-transparent outline-none resize-none min-h-[80px] text-gray-700 placeholder:text-gray-400"
                  />

                  {/* PREVIEW */}
                  {preview && (

                    <div className="mt-4 relative w-fit">

                      <img
                        src={preview}
                        className="w-32 h-32 rounded-2xl object-cover border"
                      />

                      <button
                        onClick={() => {
                          setPreview(null);
                          setCommentImage(null);
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white text-sm shadow"
                      >
                        ✕
                      </button>

                    </div>

                  )}

                  {/* ACTION */}
                  <div className="flex items-center justify-between mt-4">

                    {/* IMAGE */}
                    <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-[#32AEBB] transition-all">

                      <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">

                        <FaImage className="text-lg" />

                      </div>

                      <span className="text-sm font-medium">
                        Add Photo
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

                    {/* SEND */}
                    <button
                      onClick={handleComment}
                      disabled={commentLoading}
                      className="w-12 h-12 rounded-full bg-[#32AEBB] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                    >

                      {commentLoading ? (

                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                      ) : (

                        <span className="text-2xl rotate-[-45deg] -mr-1">
                          ➜
                        </span>

                      )}

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ) : (

            <div className="mb-10 bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] rounded-3xl p-6 text-white">

              <h3 className="text-2xl font-bold">
                Premium Required ✨
              </h3>

              <p className="mt-2 text-white/90">

                Upgrade your subscription to unlock comments, unlimited blogs and places.

              </p>

              <button
                onClick={() =>
                  window.location.href =
                  "/subscription"
                }
                className="mt-5 bg-white text-[#0047AB] font-semibold px-6 py-3 rounded-2xl hover:scale-105 transition-all"
              >

                Upgrade Now

              </button>

            </div>

          )}


          {/* COMMENT LIST */}
          <div className="space-y-6">

            {comments.length === 0 ? (

              <div className="text-center py-10">

                <p className="text-gray-500 text-lg">
                  No comments yet 😢
                </p>

              </div>

            ) : (

              comments.map((c) => (

                <div
                  key={c._id}
                  className="bg-[#FAFAFA] border border-gray-100 rounded-3xl p-5"
                >

                  <div className="flex gap-4 items-start">

                    {/* USER */}
                    <img
                      src={
                        c.user?.image
                          ? `http://localhost:3000/${c.user.image}`
                          : "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      className="w-12 h-12 rounded-full object-cover shadow"
                    />

                    {/* BODY */}
                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <div>

                          <h3 className="font-semibold text-gray-800">
                            {c.user?.name}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(
                              c.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>

                      <p className="mt-4 text-gray-700 leading-relaxed">
                        {c.text}
                      </p>

                      {c.image && (

                        <img
                          src={`http://localhost:3000/${c.image}`}
                          className="mt-5 rounded-2xl max-h-80 object-cover border"
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

export default SingleBlog;