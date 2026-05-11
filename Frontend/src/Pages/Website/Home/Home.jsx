import React, {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    FaGlobeAsia,
    FaLock,
} from "react-icons/fa";

import { MdOutlineMap } from "react-icons/md";

import { HiOutlinePhotograph } from "react-icons/hi";

import BlogCard from "../../../Component/Card/BlogCard";
import UserCardPlace from "../../../Component/Card/UserCardPlace";
import TourCard from "../../../Component/Card/TourCard";

const API =
    "http://localhost:3000/api";

const Home = () => {

    const navigate =
        useNavigate();

    const [blogs, setBlogs] =
        useState([]);

    const [places, setPlaces] =
        useState([]);

    const [blogIndex, setBlogIndex] =
        useState(0);

    const [placeIndex, setPlaceIndex] =
        useState(0);

    const [loading, setLoading] =
        useState(true);
    const [tours, setTours] =
        useState([]);

    // 🔥 USER
    const user = JSON.parse(
        localStorage.getItem("user") ||
        "null"
    );

    const subscriptionStatus =
        user?.subscription?.status ||
        "free";

    // ================= FETCH =================
    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    const blogRes =
                        await fetch(
                            `${API}/blogs/all`
                        );

                    const placeRes =
                        await fetch(
                            `${API}/places/all`
                        );
                    const tourRes =
                        await fetch(
                            `${API}/tours`
                        );


                    const tourData =
                        await tourRes.json();
                    const blogData =
                        await blogRes.json();

                    const placeData =
                        await placeRes.json();

                    let activeBlogs =
                        (
                            blogData.data || []
                        ).filter(
                            (b) =>
                                b.isActive
                        );

                    let activePlaces =
                        (
                            placeData.data || []
                        ).filter(
                            (p) =>
                                p.isActive
                        );

                    let activeTours =
                        tourData.data || [];

                    activeTours =
                        activeTours.slice(
                            0,
                            3
                        );

                    setTours(activeTours);

                    // 🔥 FREE USER
                    if (
                        subscriptionStatus ===
                        "free"
                    ) {

                        activePlaces =
                            activePlaces.slice(
                                0,
                                3
                            );

                        activeBlogs =
                            activeBlogs.slice(
                                0,
                                3
                            );
                    }

                    // 🔥 EXPIRED USER
                    if (
                        subscriptionStatus ===
                        "expired"
                    ) {

                        activePlaces =
                            activePlaces.slice(
                                0,
                                5
                            );

                        activeBlogs =
                            activeBlogs.slice(
                                0,
                                5
                            );
                    }

                    setBlogs(activeBlogs);
                    setPlaces(activePlaces);

                } catch (err) {

                    console.log(err);

                } finally {

                    setLoading(false);

                }
            };

        fetchData();

    }, [subscriptionStatus]);

    // ================= RANDOM =================
    const currentBlog =
        blogs[blogIndex];

    const currentPlace =
        places[placeIndex];

    // ================= AUTO BLOG =================
    useEffect(() => {

        if (blogs.length === 0)
            return;

        const interval =
            setInterval(() => {

                setBlogIndex(
                    (prev) =>
                        prev ===
                            blogs.length - 1
                            ? 0
                            : prev + 1
                );

            }, 5000);

        return () =>
            clearInterval(interval);

    }, [blogs]);

    // ================= AUTO PLACE =================
    useEffect(() => {

        if (places.length === 0)
            return;

        const interval =
            setInterval(() => {

                setPlaceIndex(
                    (prev) =>
                        prev ===
                            places.length - 1
                            ? 0
                            : prev + 1
                );

            }, 5000);

        return () =>
            clearInterval(interval);

    }, [places]);

    // ================= LOADING =================
    if (loading) {

        return (
            <div className="min-h-screen flex justify-center items-center">

                <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

            </div>
        );
    }

    return (
        <div className="bg-white">

            {/* ================= HERO ================= */}
            <section className="relative h-screen w-full overflow-hidden">

                <iframe
                    className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    src="https://www.youtube.com/embed/JruWsyyP9pw?autoplay=1&mute=1&loop=1&start=15&playlist=JruWsyyP9pw&controls=0"
                    allow="autoplay"
                />

                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-center px-6">

                    <div>

                        <h1 className="text-5xl md:text-7xl font-bold flex items-center justify-center gap-3">

                            Explore The World

                            <FaGlobeAsia className="text-[#32AEBB]" />

                        </h1>

                        <p className="mt-5 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">

                            Discover places, blogs & real travel stories from explorers around the world

                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/tripsnap/place"
                                )
                            }
                            className="mt-8 px-8 py-3 rounded-full bg-[#32AEBB] text-white font-semibold hover:scale-105 transition-all"
                        >
                            Start Exploring
                        </button>

                    </div>

                </div>

            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-20 bg-gradient-to-b from-white to-[#f5f9fb]">

                <div className="max-w-6xl mx-auto px-6 text-center">

                    <h2 className="text-4xl font-bold mb-4">
                        Why TripSnap?
                    </h2>

                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto">

                        Experience travel like never before with real stories, smart guides, and stunning visuals.

                    </p>

                    <div className="grid md:grid-cols-3 gap-8">

                        {/* CARD */}
                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                            <div className="flex justify-center mb-4">

                                <div className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl group-hover:scale-110 transition">

                                    <FaGlobeAsia />

                                </div>

                            </div>

                            <h3 className="text-xl font-semibold mb-2">
                                Real Experience
                            </h3>

                            <p className="text-gray-500">

                                Discover authentic travel stories shared by real explorers.

                            </p>

                        </div>

                        {/* CARD */}
                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                            <div className="flex justify-center mb-4">

                                <div className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl group-hover:scale-110 transition">

                                    <MdOutlineMap />

                                </div>

                            </div>

                            <h3 className="text-xl font-semibold mb-2">
                                Smart Guide
                            </h3>

                            <p className="text-gray-500">

                                Get day-wise plans, cost breakdowns, and travel tips.

                            </p>

                        </div>

                        {/* CARD */}
                        <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">

                            <div className="flex justify-center mb-4">

                                <div className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl group-hover:scale-110 transition">

                                    <HiOutlinePhotograph />

                                </div>

                            </div>

                            <h3 className="text-xl font-semibold mb-2">
                                Visual Journey
                            </h3>

                            <p className="text-gray-500">

                                Explore destinations through stunning images and galleries.

                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= TOUR LIST ================= */}
            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h2 className="text-3xl font-bold">
                            Recent Tours
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Explore upcoming travel tours
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/tripsnap/tour"
                            )
                        }
                        className="text-[#32AEBB] font-semibold"
                    >
                        View All →
                    </button>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {tours
                        .slice(0, 3)
                        .map((tour) => (

                            <TourCard
                                key={tour._id}
                                tour={tour}
                            />

                        ))}

                </div>

            </section>

            {/* ================= FEATURED PLACE ================= */}
            {currentPlace && (

                <section className="py-16 px-6">

                    <div className="max-w-6xl mx-auto relative">

                        <img
                            src={`http://localhost:3000/${currentPlace.thumbnailCard}`}
                            className="w-full h-[450px] object-cover rounded-3xl"
                        />

                        <div className="absolute -bottom-10 left-6 md:left-10 bg-white p-6 rounded-3xl shadow-2xl w-[90%] md:w-[45%]">

                            <p className="text-[#32AEBB] text-sm font-medium">
                                Featured Place
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {currentPlace.title}
                            </h2>

                            <p className="text-gray-600 text-sm mt-3 leading-relaxed">

                                {currentPlace.description?.slice(
                                    0,
                                    120
                                )}...

                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/tripsnap/place/${currentPlace._id}`
                                    )
                                }
                                className="mt-5 bg-[#32AEBB] text-white px-5 py-3 rounded-xl hover:scale-105 transition-all"
                            >
                                Explore →
                            </button>

                        </div>

                    </div>

                </section>

            )}

            {/* ================= BLOG LIST ================= */}
            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h2 className="text-3xl font-bold">
                            Recent Blogs
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Read latest travel experiences
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/tripsnap/blog"
                            )
                        }
                        className="text-[#32AEBB] font-semibold"
                    >
                        View All →
                    </button>

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    {blogs
                        .slice(0, 3)
                        .map((b) => (

                            <BlogCard
                                key={b._id}
                                blog={b}
                            />

                        ))}

                </div>

            </section>

            {/* ================= FEATURED BLOG ================= */}
            {currentBlog && (

                <section className="py-24 px-6 bg-gradient-to-b from-white via-[#f7fbfc] to-white overflow-hidden">

                    <div className="max-w-7xl mx-auto">

                        <div className="grid lg:grid-cols-2 gap-14 items-center">

                            {/* LEFT CONTENT */}
                            <div className="relative z-10">

                                {/* TAG */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#32AEBB]/10 text-[#32AEBB] font-semibold text-sm mb-6">

                                    <span className="w-2 h-2 rounded-full bg-[#32AEBB]"></span>

                                    Featured Blog

                                </div>

                                {/* TITLE */}
                                <h2 className="text-4xl md:text-6xl font-black leading-tight text-gray-900">

                                    Discover Hidden
                                    <span className="text-[#32AEBB]"> Travel </span>
                                    Stories

                                </h2>


                                {/* BUTTONS */}
                                <div className="flex flex-wrap gap-4 mt-10">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/tripsnap/blog/${currentBlog._id}`
                                            )
                                        }
                                        className="px-8 py-4 rounded-2xl bg-[#32AEBB] text-white font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                                    >
                                        Read Full Story →
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate("/tripsnap/blog")
                                        }
                                        className="px-8 py-4 rounded-2xl border border-gray-300 text-gray-700 font-semibold hover:bg-white transition-all"
                                    >
                                        Explore Blogs
                                    </button>

                                </div>

                            </div>

                            {/* RIGHT IMAGE */}
                            <div className="relative">

                                {/* BG EFFECT */}
                                <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#32AEBB]/20 blur-3xl rounded-full"></div>

                                {/* MAIN IMAGE */}
                                <div className="relative group rounded-[35px] overflow-hidden shadow-2xl h-102">

                                    <img
                                        src={`http://localhost:3000/${currentBlog.banner}`}
                                        className="w-full h-[550px] object-cover group-hover:scale-110 transition duration-700"
                                    />

                                    {/* OVERLAY */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                                    {/* FLOATING CARD */}
                                    <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-5 text-white">



                                        <div className="flex items-center justify-between mt-5">

                                            <div className="">

                                                <p className="text-sm text-white/70">
                                                    Trending Travel Blog
                                                </p>

                                                <h3 className="text-2xl font-bold mt-1 line-clamp-2">
                                                    {currentBlog.title}
                                                </h3>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/tripsnap/blog/${currentBlog._id}`
                                                    )
                                                }
                                                className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition"
                                            >
                                                Read
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            )}

            {/* ================= PLACE LIST ================= */}
            <section className="max-w-7xl mx-auto px-6 py-16">

                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h2 className="text-3xl font-bold">
                            Recent Places
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Explore beautiful destinations
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                "/tripsnap/place"
                            )
                        }
                        className="text-[#32AEBB] font-semibold"
                    >
                        View All →
                    </button>

                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    {places
                        .slice(0, 3)
                        .map((p) => (

                            <UserCardPlace
                                key={p._id}
                                place={p}
                            />

                        ))}

                </div>

            </section>

            {/* ================= SUBSCRIPTION ================= */}
            {(subscriptionStatus ===
                "free" ||

                subscriptionStatus ===
                "expired") && (

                    <section className="px-6 pb-20">

                        <div className="max-w-6xl mx-auto">

                            <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] rounded-3xl p-10 text-white text-center shadow-2xl">

                                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">

                                    <FaLock className="text-3xl" />

                                </div>

                                <h2 className="text-4xl font-bold">

                                    Unlock Premium Access

                                </h2>

                                <p className="mt-4 text-white/80 max-w-2xl mx-auto leading-relaxed">

                                    {subscriptionStatus ===
                                        "free"
                                        ? "Free users can access only 3 places and 3 blogs."
                                        : "Expired users can access only 5 places and 5 blogs."}

                                    {" "}
                                    Upgrade now to unlock unlimited travel destinations, blogs, comments and premium features.

                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/dashboard/user/subscription"
                                        )
                                    }
                                    className="mt-7 px-8 py-4 bg-white text-[#000080] rounded-full font-bold hover:scale-105 transition-all"
                                >
                                    Upgrade Now
                                </button>

                            </div>

                        </div>

                    </section>

                )}

        </div>
    );
};

export default Home;