import React, { useEffect, useState } from "react";
import UserCardPlace from "../../../Component/Card/UserCardPlace";
import { placeData } from "../../../Data/place";

import {
  FaSearch,
  FaLock,
  FaGlobeAsia,
} from "react-icons/fa";

const API =
  "http://localhost:3000/api/places";

const Place = () => {

  const [places, setPlaces] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [locations, setLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // 🔥 USER
  const user = JSON.parse(
    localStorage.getItem("user") ||
    "null"
  );

  // 🔥 PLAN
  const currentPlan =
    user?.subscription?.plan ||
    "free";

  // ================= HELPERS =================
  const getCountries = () =>
    placeData.map((c) => c.country);

  const getLocations = (
    country
  ) => {

    const found =
      placeData.find(
        (c) =>
          c.country === country
      );

    return found
      ? found.locations
      : [];
  };

  // ================= FETCH =================
  useEffect(() => {

    const fetchPlaces =
      async () => {

        try {

          const res =
            await fetch(
              `${API}/all`
            );

          const data =
            await res.json();

          if (data.success) {

            let activePlaces =
              (
                data.data || []
              )
                .filter(
                  (p) =>
                    p.isActive === true
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

            // 🔥 FREE = 3
            if (
              currentPlan ===
              "free"
            ) {

              activePlaces =
                activePlaces.slice(
                  0,
                  3
                );
            }

            // 🔥 EXPIRED = 5
            else if (
              currentPlan ===
              "expired"
            ) {

              activePlaces =
                activePlaces.slice(
                  0,
                  5
                );
            }

            // 🔥 PREMIUM = ALL

            setPlaces(
              activePlaces
            );

            setFiltered(
              activePlaces
            );
          }

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }
      };

    fetchPlaces();

  }, [currentPlan]);

  // ================= COUNTRY CHANGE =================
  const handleCountryChange = (
    value
  ) => {

    setCountry(value);

    setLocation("");

    setLocations(
      getLocations(value)
    );
  };

  // ================= FILTER =================
  useEffect(() => {

    let temp = [...places];

    if (search) {

      temp = temp.filter(
        (p) =>
          (
            p.title || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }

    if (country) {

      temp = temp.filter(
        (p) =>
          p.country === country
      );
    }

    if (location) {

      temp = temp.filter(
        (p) =>
          p.location === location
      );
    }

    setFiltered(temp);

  }, [
    search,
    country,
    location,
    places,
  ]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* 🔥 HEADER */}
      <div className="mb-10">

        <div className="flex items-center gap-3 mb-3">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] text-white flex items-center justify-center text-2xl shadow-lg">

            <FaGlobeAsia />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Explore Places 
            </h1>

            <p className="text-gray-500 mt-1">
              Discover amazing travel destinations around the world
            </p>

          </div>

        </div>

      </div>

      {/* 🔥 FILTER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-10">

        <div className="grid md:grid-cols-3 gap-4">

          {/* SEARCH */}
          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              placeholder="Search place..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="input pl-11"
            />

          </div>

          {/* COUNTRY */}
          <select
            value={country}
            onChange={(e) =>
              handleCountryChange(
                e.target.value
              )
            }
            className="input"
          >

            <option value="">
              Select Country
            </option>

            {getCountries().map(
              (c) => (

                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>

              )
            )}

          </select>

          {/* LOCATION */}
          <select
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            className="input"
            disabled={!country}
          >

            <option value="">
              Select Location
            </option>

            {locations.map((l) => (

              <option
                key={l}
                value={l}
              >
                {l}
              </option>

            ))}

          </select>

        </div>

      </div>

      {/* 🔥 CONTENT */}
      {loading ? (

        <div className="flex justify-center py-20">

          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : filtered.length === 0 ? (

        <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">

          <p className="text-gray-500 text-lg">
            No places found 😢
          </p>

        </div>

      ) : (

        <>
          {/* PLACE GRID */}
          <div className="grid md:grid-cols-3 gap-5">

            {filtered.map(
              (place) => (

                <UserCardPlace
                  key={place._id}
                  place={place}
                />

              )
            )}

          </div>

          {/* 🔥 LOCK CARD */}
          {(currentPlan ===
            "free" ||

            currentPlan ===
            "expired") && (

              <div className="mt-14">

                <div className="relative overflow-hidden bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] rounded-[32px] p-8 md:p-12 text-white shadow-2xl">

                  {/* BG EFFECT */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

                  <div className="relative z-10">

                    {/* ICON */}
                    <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20">

                      <FaLock className="text-4xl" />

                    </div>

                    {/* TITLE */}
                    <h2 className="text-4xl font-black text-center">

                      Unlock All Places 🔓

                    </h2>

                    {/* TEXT */}
                    <p className="mt-4 text-white/80 max-w-3xl mx-auto text-center leading-relaxed text-lg">

                      {currentPlan ===
                      "free"
                        ? "Free users can access only 3 places."
                        : "Expired users can access only 5 places."}

                      {" "}
                      Upgrade your subscription to unlock unlimited travel destinations, premium access, comments and exclusive travel features.

                    </p>

                    {/* BUTTON */}
                    <div className="flex justify-center">

                      <button
                        onClick={() =>
                          window.location.href =
                          "/dashboard/user/subscription"
                        }
                        className="mt-8 px-10 py-4 bg-white text-[#000080] rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl"
                      >

                        Upgrade Now ✨

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )}

        </>
      )}

      {/* STYLE */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 13px 14px;
          border-radius: 16px;
          outline: none;
          background: #fff;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: #32AEBB;
          box-shadow: 0 0 0 4px rgba(50,174,187,0.12);
        }
      `}</style>

    </div>
  );
};

export default Place;