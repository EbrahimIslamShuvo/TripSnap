import React, { useEffect, useState } from "react";

const MyReview = () => {

  const [comments, setComments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // 🔥 USER
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ================= FETCH =================
  useEffect(() => {

    const fetchComments =
      async () => {

        try {

          const res = await fetch(
            `http://localhost:3000/api/comments/user/${user._id}`
          );

          const data =
            await res.json();

          if (data.success) {
            setComments(data.data);
          }

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }
      };

    if (user?._id) {
      fetchComments();
    }

  }, []);

  // ================= DELETE =================
  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this review?"
        );

      if (!confirmDelete) return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res = await fetch(
          `http://localhost:3000/api/comments/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await res.json();

        console.log(data);

        if (data.success) {

          // 🔥 REMOVE UI
          setComments((prev) =>
            prev.filter(
              (item) =>
                item._id !== id
            )
          );

        } else {

          alert(
            data.message ||
            "Delete failed"
          );

        }

      } catch (err) {

        console.log(err);

        alert(
          "Something went wrong"
        );

      }
    };

  // ================= LOADING =================
  if (loading) {

    return (
      <div className="flex justify-center items-center h-[60vh]">

        <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          My Reviews
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Your recent comments &
          shared experiences
        </p>

      </div>

      {/* EMPTY */}
      {comments.length === 0 ? (

        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">

          <h2 className="text-2xl font-semibold text-gray-700">
            No reviews yet 😢
          </h2>

          <p className="text-gray-500 mt-3">
            Your reviews will appear here
          </p>

        </div>

      ) : (

        <div className="grid gap-5">

          {comments.map((c) => {

            const isPlace =
              Boolean(c.place);

            const targetUrl =
              isPlace
                ? `/tripsnap/place/${c.place._id}`
                : `/tripsnap/blog/${c.blog._id}`;

            const targetTitle =
              isPlace
                ? c.place.title
                : c.blog.title;

            return (

              <div
                key={c._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >

                {/* TOP */}
                <div className="p-5">

                  <div className="flex justify-between items-start gap-4">

                    {/* LEFT */}
                    <div className="flex gap-4">

                      {/* USER IMAGE */}
                      <img
                        src={
                          user?.image
                            ? `http://localhost:3000/${user.image}`
                            : "https://i.ibb.co/4pDNDk1/avatar.png"
                        }
                        className="w-14 h-14 rounded-full object-cover border"
                      />

                      {/* INFO */}
                      <div>

                        <div className="flex items-center gap-3 flex-wrap">

                          <h2 className="font-semibold text-lg text-gray-800">
                            {user?.name}
                          </h2>

                          <span
                            className={`
                              px-3 py-1 rounded-full text-xs font-medium
                              ${isPlace
                                ? "bg-[#32AEBB]/10 text-[#32AEBB]"
                                : "bg-orange-100 text-orange-500"
                              }
                            `}
                          >
                            {isPlace
                              ? "Place"
                              : "Blog"}
                          </span>

                        </div>

                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(
                            c.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        handleDelete(c._id)
                      }
                      className="
                        px-4 py-2 rounded-full
                        bg-red-50 text-red-500
                        hover:bg-red-500 hover:text-white
                        transition-all duration-300
                        text-sm font-medium
                      "
                    >
                      Delete
                    </button>

                  </div>

                  {/* COMMENT */}
                  <p className="mt-5 text-gray-700 leading-relaxed text-[15px]">
                    {c.text}
                  </p>

                  {/* IMAGE */}
                  {c.image && (

                    <img
                      src={`http://localhost:3000/${c.image}`}
                      className="mt-5 rounded-2xl max-h-80 object-cover border"
                    />

                  )}

                </div>

                {/* FOOTER */}
                <div
                  onClick={() =>
                    window.location.href =
                    targetUrl
                  }
                  className="border-t bg-gray-50 px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-all"
                >

                  <div>

                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {isPlace
                        ? "Place"
                        : "Blog"}
                    </p>

                    <h3 className="font-semibold text-gray-800 mt-1">
                      {targetTitle}
                    </h3>

                  </div>

                  <button className="px-4 py-2 rounded-full bg-[#32AEBB] text-white text-sm font-medium">
                    Open
                  </button>

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
};

export default MyReview;