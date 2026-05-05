import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] text-white py-20 text-center">
        <h1 className="text-4xl font-bold">About TripSnap 🌍</h1>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto">
          Discover, share, and explore amazing travel experiences from people around the world.
        </p>
      </div>

      {/* WHO WE ARE */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              TripSnap is a platform where travelers can share their journeys,
              discover hidden gems, and connect with other explorers. Whether you
              are a beginner or a pro traveler, TripSnap helps you capture your
              moments and inspire others.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              className="rounded-xl shadow-lg"
              alt="travel"
            />
          </div>

        </div>

      </div>

      {/* 🔥 MISSION & VISION (NEW DESIGN) */}
      <div className="max-w-6xl mx-auto px-6 pb-16">

        <h2 className="text-2xl font-bold text-center mb-10">
          Our Purpose 🎯
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* MISSION */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border-l-4 border-[#32AEBB]">
            <h3 className="text-xl font-semibold mb-3">🚀 Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To empower travelers by providing a platform where they can easily
              share their experiences, inspire others, and discover new destinations.
              We aim to make travel storytelling simple, engaging, and accessible.
            </p>
          </div>

          {/* VISION */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border-l-4 border-[#0047AB]">
            <h3 className="text-xl font-semibold mb-3">🌍 Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become a global community where every traveler’s story matters,
              connecting people across cultures and inspiring a new generation
              of explorers to see the world differently.
            </p>
          </div>

        </div>

      </div>

      {/* FEATURES */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-bold text-center mb-10">
            What You Can Do 🚀
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <FeatureCard
              title="Share Blogs ✍️"
              desc="Write and share your travel stories with the world."
            />

            <FeatureCard
              title="Explore Places 📍"
              desc="Find amazing places shared by other travelers."
            />

            <FeatureCard
              title="Connect 🌐"
              desc="Follow and explore content from your favorite creators."
            />

          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#32AEBB] to-[#0047AB] text-white py-16 text-center">
        <h2 className="text-2xl font-bold">Start Your Journey Today ✈️</h2>
        <p className="mt-2 text-white/80">
          Join TripSnap and share your travel story with the world.
        </p>
      </div>

    </div>
  );
};

export default About;

// 🔥 FEATURE CARD
const FeatureCard = ({ title, desc }) => (
  <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);