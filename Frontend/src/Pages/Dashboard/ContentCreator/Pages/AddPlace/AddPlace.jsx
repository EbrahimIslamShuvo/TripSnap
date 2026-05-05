import React, { useEffect, useState } from "react";
import Card from "../../../../../Component/Card/Card";
import { placeData } from "../../../../../Data/place";

const API = "http://localhost:3000/api/places";

const AddPlace = () => {
  const [showForm, setShowForm] = useState(false);
  const [places, setPlaces] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    thumbnailCard: null,
    thumbnailDetails: null,
    images: [],
  });

  const [locations, setLocations] = useState([]);

  const [preview, setPreview] = useState({
    thumbnailCard: null,
    thumbnailDetails: null,
    images: [],
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 3000);
  };

  // ================= HELPERS =================
  const getCountries = () => placeData.map((c) => c.country);

  const getLocations = (country) => {
    const found = placeData.find((c) => c.country === country);
    return found ? found.locations : [];
  };

  // ================= FETCH =================
  const fetchPlaces = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) setPlaces(data.data);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // ================= COUNTRY =================
  const handleCountryChange = (value) => {
    setForm((prev) => ({
      ...prev,
      country: value,
      location: "",
    }));

    setLocations(getLocations(value));
  };

  // ================= FILE =================
  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, [field]: file }));
    setPreview((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
  };

  const handleMultipleImages = (files) => {
    const arr = Array.from(files);

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...arr],
    }));

    setPreview((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...arr.map((file) => URL.createObjectURL(file)),
      ],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreview((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.title) return showToast("Title is required");
    if (!form.description) return showToast("Description is required");
    if (!form.location) return showToast("Location is required");
    if (!form.country) return showToast("Country is required");
    if (!form.thumbnailCard) return showToast("Card thumbnail required");
    if (!form.thumbnailDetails) return showToast("Details thumbnail required");
    if (form.images.length === 0) return showToast("Add at least 1 image");

    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("location", form.location);
      fd.append("country", form.country);

      fd.append("thumbnailCard", form.thumbnailCard);
      fd.append("thumbnailDetails", form.thumbnailDetails);

      form.images.forEach((img) => {
        fd.append("images", img);
      });

      const res = await fetch(`${API}/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message);

      showToast("Place added successfully ✅", "success");

      setForm({
        title: "",
        description: "",
        location: "",
        country: "",
        thumbnailCard: null,
        thumbnailDetails: null,
        images: [],
      });

      setPreview({
        thumbnailCard: null,
        thumbnailDetails: null,
        images: [],
      });

      setLocations([]);
      setShowForm(false);
      fetchPlaces();
    } catch {
      showToast("Network error ❌");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* TOAST */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 w-80">
          <div className={`px-4 py-3 rounded-lg text-white ${
            toast.type === "success" ? "bg-[#32AEBB]" : "bg-[#F48C3C]"
          }`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">My Places</h2>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#32AEBB] text-white px-4 py-2 rounded-lg"
        >
          {showForm ? "Close" : "+ Add Place"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow max-w-5xl mx-auto">

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input h-24"
          />

          {/* COUNTRY */}
          <select
            value={form.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="input"
          >
            <option value="">Select Country</option>
            {getCountries().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* LOCATION */}
          <select
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
            className="input"
            disabled={!form.country}
          >
            <option value="">Select Location</option>
            {locations.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>

          <FileInput label="Card Thumbnail" preview={preview.thumbnailCard} onChange={(e) => handleFile(e, "thumbnailCard")} />
          <FileInput label="Details Thumbnail" preview={preview.thumbnailDetails} onChange={(e) => handleFile(e, "thumbnailDetails")} />

          <button onClick={handleSubmit} className="w-full bg-[#32AEBB] text-white py-2 rounded-lg">
            Add Place
          </button>

        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {places.map((p) => (
          <Card key={p._id} place={p} />
        ))}
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default AddPlace;

// FILE INPUT
const FileInput = ({ label, preview, onChange }) => (
  <div>
    <p className="mb-2 text-sm">{label}</p>

    <label className="cursor-pointer block border-2 border-dashed p-4 rounded-lg text-center">
      {preview ? (
        <img src={preview} className="h-32 mx-auto object-cover rounded" />
      ) : (
        <span className="text-gray-500">Click to upload</span>
      )}

      <input type="file" hidden onChange={onChange} />
    </label>
  </div>
);