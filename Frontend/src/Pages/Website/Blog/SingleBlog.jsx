import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = "http://localhost:3000/api/blogs";

const SingleBlog = () => {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        if (data.success) setBlog(data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const imageUrl = (img) =>
    img?.includes("uploads")
      ? `http://localhost:3000/${img}`
      : `http://localhost:3000/uploads/${img}`;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center p-10 text-gray-500">
        Blog not found 😢
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🔥 HERO IMAGE ONLY */}
      <div className="relative h-[350px] md:h-[450px]">
        <img
          src={imageUrl(blog.banner)}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 🔥 BLUR TITLE CARD */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">

        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-6 border border-white/40">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {blog.title}
          </h1>

          <p className="mt-2 text-gray-600">
            ✍️ {blog.createdBy?.name || "Unknown"}
          </p>

        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* 🔥 SECTIONS */}
        {blog.sections?.map((sec, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow space-y-3">

            {/* TEXT */}
            {sec.type === "text" && (
              <>
                <h2 className="text-xl font-semibold">
                  {sec.title}
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {sec.content}
                </p>
              </>
            )}

            {/* IMAGE */}
            {sec.type === "image" && (
              <img
                src={imageUrl(sec.image)}
                className="w-full rounded-lg"
              />
            )}

            {/* TABLE */}
            {sec.type === "table" && (
              <div>
                <h2 className="font-semibold mb-2">
                  {sec.table?.title}
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-max border border-gray-300 border-collapse w-full">

                    <thead>
                      <tr>
                        {sec.table?.columns?.map((col, idx) => (
                          <th
                            key={idx}
                            className="border border-gray-300 p-2 bg-gray-100"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {sec.table?.rows?.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className="border border-gray-300 p-2"
                            >
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

        {/* 🔥 GALLERY */}
        {blog.gallery?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
              Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blog.gallery.map((img, i) => (
                <img
                  key={i}
                  src={imageUrl(img)}
                  className="h-40 w-full object-cover rounded-lg hover:scale-105 transition"
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SingleBlog;