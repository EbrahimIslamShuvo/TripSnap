import React, { useEffect, useState } from "react";
import UserCardPlace from "../../../Component/Card/UserCardPlace";
import { placeData } from "../../../Data/place";

const API = "http://localhost:3000/api/places";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState("");

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= HELPERS =================
  const getCountries = () => placeData.map((c) => c.country);

  const getLocations = (country) => {
    const found = placeData.find((c) => c.country === country);
    return found ? found.locations : [];
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch(`${API}/all`);
        const data = await res.json();

        console.log("PLACES:", data);

        if (data.success) {
          // 🔥 ONLY ACTIVE
          const activePlaces = (data.data || []).filter(
            (p) => p.isActive === true
          );

          setPlaces(activePlaces);
          setFiltered(activePlaces);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // ================= COUNTRY CHANGE =================
  const handleCountryChange = (value) => {
    setCountry(value);
    setLocation("");
    setLocations(getLocations(value));
  };

  // ================= FILTER =================
  useEffect(() => {
    let temp = [...places];

    if (search) {
      temp = temp.filter((p) =>
        (p.title || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (country) {
      temp = temp.filter((p) => p.country === country);
    }

    if (location) {
      temp = temp.filter((p) => p.location === location);
    }

    setFiltered(temp);
  }, [search, country, location, places]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Explore Places 🌍</h1>

      {/* FILTER */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        {/* SEARCH */}
        <input
          placeholder="Search place..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />

        {/* COUNTRY */}
        <select
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="input"
        >
          <option value="">Select Country</option>
          {getCountries().map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* LOCATION */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input"
          disabled={!country}
        >
          <option value="">Select Location</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No places found 😢</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {filtered.map((place) => (
            <UserCardPlace key={place._id} place={place} />
          ))}
        </div>
      )}

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

export default Place;