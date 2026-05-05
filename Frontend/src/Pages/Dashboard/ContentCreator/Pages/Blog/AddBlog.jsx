import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api/blogs";
const BASE_URL = "http://localhost:3000";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const [gallery, setGallery] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);

  const [sections, setSections] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchPlaces = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/places/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPlaces(data.data);
    };
    fetchPlaces();
  }, []);

  const togglePlace = (id) => {
    setSelectedPlaces((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

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

  const updateSection = (i, field, value) => {
    const updated = [...sections];
    updated[i][field] = value;
    setSections(updated);
  };

  const handleSectionImage = (i, file) => {
    const updated = [...sections];
    updated[i].image = file;
    updated[i].preview = URL.createObjectURL(file);
    setSections(updated);
  };

  const addColumn = (i) => {
    const updated = [...sections];
    updated[i].table.columns.push("");
    updated[i].table.rows = updated[i].table.rows.map((r) => [...r, ""]);
    setSections(updated);
  };

  const addRow = (i) => {
    const updated = [...sections];
    const colCount = updated[i].table.columns.length;
    updated[i].table.rows.push(new Array(colCount).fill(""));
    setSections(updated);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("title", title);
      fd.append("banner", banner);

      gallery.forEach((img) => fd.append("gallery", img));

      const cleanSections = sections.map((sec) => ({
        type: sec.type,
        title: sec.title,
        content: sec.content,
        table: sec.table,
      }));

      fd.append("sections", JSON.stringify(cleanSections));
      fd.append("places", JSON.stringify(selectedPlaces));

      sections.forEach((sec) => {
        if (sec.type === "image" && sec.image) {
          fd.append("sectionImages", sec.image);
        }
      });

      const res = await fetch(`${API}/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) return setError(data.message);

      alert("Blog created ✅");

      setTitle("");
      setBanner(null);
      setBannerPreview(null);
      setGallery([]);
      setGalleryPreview([]);
      setSections([]);
      setSelectedPlaces([]);
      setResetKey((p) => p + 1);

    } catch (err) {
      console.log(err);
      setError("Something went wrong ❌");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <h1 className="text-3xl font-bold">Create Blog ✍️</h1>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      {/* TITLE */}
      <input
        className="w-full border p-3 rounded-lg"
        placeholder="Blog Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* BANNER */}
      <label className="border-2 border-dashed rounded-xl p-6 block text-center cursor-pointer">
        {bannerPreview ? (
          <img src={bannerPreview} className="h-52 w-full object-cover rounded-xl" />
        ) : (
          <span>Upload Banner</span>
        )}
        <input
          key={resetKey}
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            setBanner(file);
            setBannerPreview(URL.createObjectURL(file));
          }}
        />
      </label>

      {/* GALLERY */}
      <label className="border-2 border-dashed rounded-xl p-6 block text-center cursor-pointer">
        Upload Gallery
        <input
          key={resetKey}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setGallery([...gallery, ...files]);
            setGalleryPreview([
              ...galleryPreview,
              ...files.map((f) => URL.createObjectURL(f)),
            ]);
          }}
        />
      </label>

      <div className="grid grid-cols-4 gap-3">
        {galleryPreview.map((img, i) => (
          <img key={i} src={img} className="h-24 w-full object-cover rounded" />
        ))}
      </div>

      {/* PLACES */}
      <div>
        <div className="border p-3 rounded-lg cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}>
          {selectedPlaces.length
            ? `${selectedPlaces.length} selected`
            : "Select places"}
        </div>

        {showDropdown && (
          <div className="border mt-2 p-2 max-h-60 overflow-y-auto space-y-2">
            {places
              .filter((p) => p.isActive)
              .map((p) => (
                <label
                  key={p._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  {/* IMAGE */}
                  {console.log(p.thumbnailCard)}
                  <img
                    src={
                      p.thumbnailCard
                        ? `${BASE_URL}/${p.thumbnailCard.replace(/\\/g, "/").replace(/^\/?/, "")}`
                        : "https://via.placeholder.com/60"
                    }
                    alt={p.title}
                    className="w-14 h-14 object-cover rounded-md"
                  />

                  {/* TEXT */}
                  <div className="flex-1">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-gray-500">
                      {p.location || "Unknown location"},{p.country || "Unknown location"}
                    </p>
                  </div>

                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={selectedPlaces.includes(p._id)}
                    onChange={() => togglePlace(p._id)}
                    className="w-4 h-4"
                  />
                </label>
              ))}
          </div>
        )}
      </div>

      {/* SECTION BUTTONS */}
      <div className="flex gap-3">
        <button onClick={() => addSection("text")} className="btn">Text</button>
        <button onClick={() => addSection("image")} className="btn">Image</button>
        <button onClick={() => addSection("table")} className="btn">Table</button>
      </div>

      {/* SECTIONS */}
      {sections.map((sec, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow space-y-3">

          {/* TEXT */}
          {sec.type === "text" && (
            <>
              <input className="input" placeholder="Title"
                value={sec.title}
                onChange={(e) => updateSection(i, "title", e.target.value)} />

              <textarea className="input" placeholder="Content"
                value={sec.content}
                onChange={(e) => updateSection(i, "content", e.target.value)} />
            </>
          )}

          {/* IMAGE SECTION (🔥 IMPROVED UI) */}
          {sec.type === "image" && (
            <label className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer">
              {sec.preview ? (
                <img src={sec.preview} className="h-40 mx-auto rounded-lg" />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleSectionImage(i, e.target.files[0])
                }
              />
            </label>
          )}

          {/* TABLE */}
          {sec.type === "table" && (
            <>
              <input className="input" placeholder="Table Title"
                value={sec.table.title}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[i].table.title = e.target.value;
                  setSections(updated);
                }}
              />

              <div className="flex gap-2">
                <button onClick={() => addColumn(i)} className="btn">+ Column</button>
                <button onClick={() => addRow(i)} className="btn">+ Row</button>
              </div>

              <div className="overflow-x-auto mt-2">
                <table className="min-w-max border border-gray-300 border-collapse">

                  <thead>
                    <tr>
                      {sec.table.columns.map((col, cIdx) => (
                        <th key={cIdx} className="border p-2 bg-gray-100">
                          <input
                            value={col}
                            className="w-full outline-none"
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
                              className="w-full outline-none"
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

      <button onClick={handleSubmit} className="submit-btn">
        Publish Blog 🚀
      </button>

      <style>{`
        .btn { background:#32AEBB; color:white; padding:8px 14px; border-radius:6px; }
        .input { width:100%; border:1px solid #ccc; padding:10px; border-radius:6px; }
        .submit-btn { width:100%; background:black; color:white; padding:14px; border-radius:8px; }
      `}</style>

    </div>
  );
};

export default AddBlog;