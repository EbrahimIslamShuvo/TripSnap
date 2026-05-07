import React from "react";
import { NavLink } from "react-router-dom";

const UserCardPlace = ({ place }) => {
  const isActive = place.isActive;

  return (
    <div className="group relative h-56 rounded-xl overflow-hidden shadow-lg cursor-pointer">

      {/* 🔥 BACKGROUND IMAGE */}
      <img
        src={
          place.thumbnailCard?.includes("uploads")
            ? `http://localhost:3000/${place.thumbnailCard}`
            : `http://localhost:3000/uploads/${place.thumbnailCard}`
        }
        alt={place.title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

      {/* GLOW BORDER (SUBTLE)ss */}
      <div
        className={`absolute inset-0 rounded-xl pointer-events-none border-2 transition
        ${
          isActive
            ? "border-green-400/40 group-hover:border-green-400"
            : "border-yellow-300/40 group-hover:border-yellow-400"
        }`}
      ></div>

      {/*  CONTENT */}
      <div className="absolute bottom-0 p-4 text-white w-full">

        <NavLink to={`/tripsnap/place/${place._id}`} className="text-lg font-semibold leading-tight">
          {place.title}
        </NavLink>

        <p className="text-sm text-gray-300">
          📍 {place.location}, {place.country}
        </p>

      </div>
    </div>
  );
};

export default UserCardPlace;