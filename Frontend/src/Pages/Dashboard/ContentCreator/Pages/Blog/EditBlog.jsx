import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api/blogs";
const BASE_URL = "http://localhost:3000";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [sections, setSections] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ================= LOAD =================
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();

      if (data.success) {
        const blog = data.data;

        setTitle(blog.title);
        setBannerPreview(`${BASE_URL}/${blog.banner}`);

        setSections(
          blog.sections.map((sec) => ({
            ...sec,
            image: null,
            preview: sec.image ? `${BASE_URL}/${sec.image}` : null,
            table: sec.table || { title: "", columns: [], rows: [] },
          }))
        );

        setSelectedPlaces(blog.places.map((p) => p._id));
      }
    };

    fetchBlog();
  }, [id]);

  // ================= SECTION =================
  const addSection = (type) => {
    setSections([
      ...sections,
      {
        type,
        title: "",
        content: "",
        image: null,
        preview: null,
        table: { title: "", columns: [], rows: [] },
      },
    ]);
  };

  const deleteSection = (i) => {
    setSections(sections.filter((_, idx) => idx !== i));
  };

  const updateSection = (i, field, value) => {
    const updated = [...sections];
    updated[i][field] = value;
    setSections(updated);
  };

  const handleImage = (i, file) => {
    if (!file) return;

    const updated = [...sections];
    updated[i].image = file;
    updated[i].preview = URL.createObjectURL(file);
    setSections(updated);
  };

  const removeImage = (i) => {
    const updated = [...sections];
    updated[i].image = null;
    updated[i].preview = null;
    setSections(updated);
  };

  // ================= TABLE =================
  const addColumn = (i) => {
    const updated = [...sections];
    updated[i].table.columns.push("");
    updated[i].table.rows = updated[i].table.rows.map((r) => [...r, ""]);
    setSections(updated);
  };

  const addRow = (i) => {
    const updated = [...sections];
    const col = updated[i].table.columns.length;
    updated[i].table.rows.push(new Array(col).fill(""));
    setSections(updated);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("title", title);
      fd.append("places", JSON.stringify(selectedPlaces));

      const cleanSections = sections.map((sec) => ({
        type: sec.type,
        title: sec.title,
        content: sec.content,
        table: sec.table,
      }));

      fd.append("sections", JSON.stringify(cleanSections));

      // 🔥 IMAGE UPLOAD FIX
      sections.forEach((sec) => {
        if (sec.type === "image" && sec.image instanceof File) {
          fd.append("sectionImages", sec.image);
        }
      });

      if (banner) fd.append("banner", banner);

      const res = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message);

      showToast("Updated ✅");

      setTimeout(() => {
        navigate(`/tripsnap/blog/${id}`);
      }, 1200);
    } catch {
      showToast("Error ❌");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold">Edit Blog</h1>

      {/* TITLE */}
      <input
        className="w-full border p-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 🔥 BANNER */}
      <div className="space-y-2">
        <label className="border-2 border-dashed rounded-xl p-4 cursor-pointer block">
          {bannerPreview ? (
            <img src={bannerPreview} className="h-52 w-full object-cover rounded-xl" />
          ) : (
            <p className="text-center text-gray-500">Upload Banner</p>
          )}

          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              setBanner(file);
              setBannerPreview(URL.createObjectURL(file));
            }}
          />
        </label>

        {bannerPreview && (
          <button
            onClick={() => {
              setBanner(null);
              setBannerPreview(null);
            }}
            className="text-red-500 text-sm"
          >
            Remove Banner
          </button>
        )}
      </div>

      {/* SECTION BUTTON */}
      <div className="flex gap-2">
        <button onClick={() => addSection("text")} className="btn">Text</button>
        <button onClick={() => addSection("image")} className="btn">Image</button>
        <button onClick={() => addSection("table")} className="btn">Table</button>
      </div>

      {/* SECTIONS */}
      {sections.map((sec, i) => (
        <div key={i} className="bg-white p-4 rounded shadow space-y-4">

          <button onClick={() => deleteSection(i)} className="text-red-500">
            Delete
          </button>

          {/* TEXT */}
          {sec.type === "text" && (
            <>
              <input
                value={sec.title}
                onChange={(e) => updateSection(i, "title", e.target.value)}
                className="input"
              />
              <textarea
                value={sec.content}
                onChange={(e) => updateSection(i, "content", e.target.value)}
                className="input"
              />
            </>
          )}

          {/* IMAGE */}
          {sec.type === "image" && (
            <div>
              <label className="border-2 border-dashed p-4 rounded cursor-pointer block">
                {sec.preview ? (
                  <img src={sec.preview} className="h-40 w-full object-cover rounded" />
                ) : (
                  <p className="text-center text-gray-500">Upload Image</p>
                )}

                <input
                  type="file"
                  hidden
                  onChange={(e) => handleImage(i, e.target.files[0])}
                />
              </label>

              {sec.preview && (
                <button
                  onClick={() => removeImage(i)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove Image
                </button>
              )}
            </div>
          )}

          {/* 🔥 TABLE IMPROVED */}
          {sec.type === "table" && (
            <>
              <input
                value={sec.table.title}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[i].table.title = e.target.value;
                  setSections(updated);
                }}
                className="input"
                placeholder="Table Title"
              />

              <div className="flex gap-2">
                <button onClick={() => addColumn(i)} className="btn">+ Column</button>
                <button onClick={() => addRow(i)} className="btn">+ Row</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse text-sm">

                  <thead>
                    <tr>
                      {sec.table.columns.map((col, cIdx) => (
                        <th key={cIdx} className="border p-2 bg-gray-100">
                          <input
                            value={col}
                            className="w-full p-1 outline-none"
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[i].table.columns[cIdx] = e.target.value;
                              setSections(updated);
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {sec.table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border p-2">
                            <input
                              value={cell}
                              className="w-full p-1 outline-none"
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[i].table.rows[rIdx][cIdx] = e.target.value;
                                setSections(updated);
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </>
          )}

        </div>
      ))}

      <button onClick={handleUpdate} className="submit-btn">
        Update Blog 🚀
      </button>

      <style>{`
        .btn { background:#32AEBB; color:white; padding:6px 12px; border-radius:6px; }
        .input { width:100%; border:1px solid #ccc; padding:8px; border-radius:6px; }
        .submit-btn { background:black; color:white; padding:12px; width:100%; }
      `}</style>
    </div>
  );
};

export default EditBlog;