import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const API = "http://localhost:3000/api/places";

const AllPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TOAST
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // 🔥 FETCH
  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setPlaces(data.data);
      }
    } catch (err) {
      console.log(err);
      showToast("Failed to load places ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // 🔥 APPROVE
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/approve/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return showToast(data.message, "error");

      // 🔥 UPDATE UI
      setPlaces((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isActive: true } : p
        )
      );

      showToast("Place approved ✅");

    } catch (err) {
      console.log(err);
      showToast("Error ❌", "error");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">

      {/* 🔥 TOAST */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 w-80 animate-slide">
          <div
            className={`relative px-4 py-3 rounded-lg shadow-lg text-white
            ${toast.type === "success" ? "bg-[#32AEBB]" : "bg-[#F48C3C]"}`}
          >
            {toast.message}
            <div className="absolute bottom-0 left-0 h-1 bg-white/80 animate-progress"></div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-6">
        All Places (Admin)
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-5">

        {places.map((place) => (
          <div
            key={place._id}
            className="group relative rounded-xl overflow-hidden shadow-lg"
          >

            {/* IMAGE */}
            <img
              src={`http://localhost:3000/${place.thumbnailCard}`}
              className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            {/* STATUS */}
            <span
              className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-medium
              ${
                place.isActive
                  ? "bg-green-500 text-white"
                  : "bg-yellow-400 text-black"
              }`}
            >
              {place.isActive ? "Approved" : "Pending"}
            </span>

            {/* CONTENT */}
            <div className="absolute bottom-0 p-4 text-white w-full">
              <NavLink to={`/tripsnap/place/${place._id}`} className="font-semibold">{place.title}</NavLink>

              <p className="text-sm text-gray-300">
                📍 {place.location}, {place.country}
              </p>

              {/* APPROVE BUTTON */}
              {!place.isActive && (
                <button
                  onClick={() => handleApprove(place._id)}
                  className="mt-3 w-full bg-[#32AEBB] py-1 rounded hover:bg-[#2a98a3]"
                >
                  Approve
                </button>
              )}
            </div>

          </div>
        ))}

      </div>

      {/* STYLE */}
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .animate-progress {
          animation: progress 3s linear forwards;
        }

        @keyframes slide {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-slide {
          animation: slide 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AllPlaces;