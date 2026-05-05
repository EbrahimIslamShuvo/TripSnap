import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGlobeAsia } from "react-icons/fa";
import { MdOutlineMap } from "react-icons/md";
import { HiOutlinePhotograph } from "react-icons/hi";
import BlogCard from "../../../Component/Card/BlogCard";
import UserCardPlace from "../../../Component/Card/UserCardPlace";

const API = "http://localhost:3000/api";

const Home = () => {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [places, setPlaces] = useState([]);

    const [blogIndex, setBlogIndex] = useState(0);
    const [placeIndex, setPlaceIndex] = useState(0);

    const [loading, setLoading] = useState(true);

    // ================= FETCH =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const blogRes = await fetch(`${API}/blogs/all`);
                const placeRes = await fetch(`${API}/places/all`);

                const blogData = await blogRes.json();
                const placeData = await placeRes.json();

                setBlogs(blogData.data || []);
                setPlaces(placeData.data || []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ================= FILTER =================
    const activeBlogs = blogs.filter((b) => b.isActive);
    const activePlaces = places.filter((p) => p.isActive);

    const currentBlog = activeBlogs[blogIndex];
    const currentPlace = activePlaces[placeIndex];

    // ================= AUTO CHANGE =================
    useEffect(() => {
        if (activeBlogs.length === 0) return;

        const interval = setInterval(() => {
            setBlogIndex((prev) =>
                prev === activeBlogs.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [activeBlogs]);

    useEffect(() => {
        if (activePlaces.length === 0) return;

        const interval = setInterval(() => {
            setPlaceIndex((prev) =>
                prev === activePlaces.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [activePlaces]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div>

            {/* ================= HERO ================= */}
            <section className="relative h-screen w-full overflow-hidden">
                <iframe
                    className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    src="https://www.youtube.com/embed/JruWsyyP9pw?autoplay=1&mute=1&loop=1&start=15&playlist=JruWsyyP9pw&controls=0"
                    allow="autoplay"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-center">
                    <div>
                        <h1 className="text-5xl font-bold flex items-center justify-center gap-2">
                            Explore The World <FaGlobeAsia className="text-[#32AEBB]" />
                        </h1>
                        <p className="mt-4 text-lg">
                            Discover places, blogs & real travel stories
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section
                className="py-20 bg-gradient-to-b from-white to-[#f5f9fb]">
                <div
                    className="max-w-6xl mx-auto px-6 text-center">
                    <h2
                        className="text-4xl font-bold mb-4">
                        Why TripSnap?
                    </h2>
                    <p
                        className="text-gray-500 mb-12 max-w-2xl mx-auto">
                        Experience travel like never before with real stories, smart guides, and stunning visuals.
                    </p>
                    <div
                        className="grid md:grid-cols-3 gap-8"> {/* CARD 1 */}
                        <div
                            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">
                            <div
                                className="flex justify-center mb-4">
                                <div
                                    className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl transition group-hover:scale-110">
                                    <FaGlobeAsia />
                                </div> </div>
                            <h3
                                className="text-xl font-semibold mb-2">
                                Real Experience
                            </h3>
                            <p
                                className="text-gray-500"> Discover authentic travel stories shared by real explorers.
                            </p>
                        </div> {/* CARD 2 */}
                        <div
                            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl transition group-hover:scale-110">
                                    <MdOutlineMap />
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold mb-2">
                                Smart Guide
                            </h3>
                            <p className="text-gray-500">
                                Get day-wise plans, cost breakdowns, and travel tips.
                            </p>
                        </div> {/* CARD 3 */}
                        <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="bg-[#32AEBB]/10 p-4 rounded-full text-[#32AEBB] text-3xl transition group-hover:scale-110">
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

            {/* ================= RANDOM PLACE ================= */}
            {currentPlace && (
                <section className="py-16 px-6">
                    <div className="max-w-6xl mx-auto relative">

                        <img
                            src={`http://localhost:3000/${currentPlace.thumbnailCard}`}
                            className="w-full h-[400px] object-cover rounded-2xl"
                        />

                        <div className="absolute -bottom-10 left-10 bg-white p-6 rounded-2xl shadow-xl w-[90%] md:w-[50%]">

                            <p className="text-[#32AEBB] text-sm">Featured Place</p>

                            <h2 className="text-2xl font-semibold">
                                {currentPlace.title}
                            </h2>

                            <p className="text-gray-600 text-sm mt-2">
                                {currentPlace.description?.slice(0, 120)}...
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/tripsnap/place/${currentPlace._id}`)
                                }
                                className="mt-4 bg-[#32AEBB] text-white px-4 py-2 rounded-lg"
                            >
                                Explore →
                            </button>

                        </div>
                    </div>
                </section>
            )}

            {/* ================= BLOG LIST ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Recent Blogs</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {activeBlogs.slice(0, 3).map((b) => (
                        <BlogCard key={b._id} blog={b} />
                    ))}
                </div>
            </section>

            {/* ================= RANDOM BLOG ================= */}
            {currentBlog && (
                <section className="py-20 px-6 bg-gradient-to-b from-white to-[#f5f9fb]">

                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                        {/* LEFT */}
                        <div>
                            <p className="text-[#32AEBB] text-sm uppercase">
                                Featured Blog
                            </p>

                            <h2 className="text-4xl font-bold">
                                Discover Travel Stories 🌍
                            </h2>

                            <p className="text-gray-600 mt-3">
                                {currentBlog.sections?.[0]?.content?.slice(0, 120)}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/tripsnap/blog/${currentBlog._id}`)
                                }
                                className="mt-4 bg-[#32AEBB] text-white px-6 py-3 rounded-xl"
                            >
                                Read →
                            </button>
                        </div>

                        {/* RIGHT */}
                        <div className="h-[400px] rounded-2xl overflow-hidden">
                            <img
                                src={`http://localhost:3000/${currentBlog.banner}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                    </div>

                </section>
            )}

            {/* ================= PLACE LIST ================= */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold mb-6">Recent Places</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {activePlaces.slice(0, 3).map((p) => (
                        <UserCardPlace key={p._id} place={p} />
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;