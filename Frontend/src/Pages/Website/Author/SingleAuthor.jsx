import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import BlogCard from "../../../Component/Card/BlogCard";

const API = "http://localhost:3000/api";
const BASE_URL = "http://localhost:3000";

const SingleAuthor = () => {
    const { id } = useParams();

    const safeId =
        typeof id === "string"
            ? id
            : Array.isArray(id)
                ? id[0]
                : null;

    const [author, setAuthor] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= FETCH =================
    useEffect(() => {
        if (!safeId) return;

        const fetchData = async () => {
            try {
                // 🔥 USER
                const resUser = await fetch(`${API}/users/${safeId}`);
                const userData = await resUser.json();

                // 🔥 BLOG
                const resBlogs = await fetch(`${API}/blogs/author/${safeId}`);
                const blogData = await resBlogs.json();

                if (userData?.success) {
                    setAuthor(userData.data);
                }

                if (blogData?.success) {
                    // 🔥 ONLY ACTIVE BLOG
                    const activeBlogs = (blogData.data || []).filter(
                        (b) => b.isActive === true
                    );

                    // 🔥 SORT (NEW → OLD)
                    const sorted = activeBlogs.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    setBlogs(sorted);
                }

            } catch (err) {
                console.log("FETCH ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [safeId]);

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ================= NOT FOUND =================
    if (!author) {
        return (
            <div className="text-center p-10 text-gray-500">
                Author not found 😢
            </div>
        );
    }

    // ================= IMAGE =================
    const imageUrl = (img) =>
        img?.includes("uploads")
            ? `${BASE_URL}/${img}`
            : `${BASE_URL}/uploads/${img}`;

    const fixUrl = (url) => {
        if (!url) return "#";
        return url.startsWith("http")
            ? url
            : `https://${url}`;
    };

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* 🔥 HERO CARD */}
            <div className="bg-gradient-to-r from-[#000080] via-[#0047AB] to-[#32AEBB] py-16">

                <div className="max-w-6xl mx-auto px-6">

                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 text-white shadow-xl">

                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

                            {/* IMAGE */}
                            <div className="flex-shrink-0">
                                <div className="relative w-28 h-28 md:w-32 md:h-32 ">
                                    <img
                                        src={imageUrl(author.image)}
                                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                                    />

                                </div>
                            </div>

                            {/* INFO */}
                            <div className="flex-1 text-center md:text-left">

                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {author.name}
                                </h1>

                                <p className="text-white/70 text-sm mt-1">
                                    {author.email}
                                </p>

                                <p className="mt-4 text-white/80 max-w-lg text-sm">
                                    {author.bio || "Travel enthusiast ✈️ Exploring the world"}
                                </p>

                                {/* <div className="mt-4 text-sm">
                                    <span className="font-bold">{blogs.length}</span> Blogs Published
                                </div> */}

                            </div>

                            {/* SOCIAL */}
                            <div className="flex md:flex-col gap-3 md:gap-4 justify-center md:justify-end items-center">

                                {author?.social?.facebook && (
                                    <a href={fixUrl(author.social.facebook)} target="_blank" rel="noopener noreferrer">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-blue-500 transition">
                                            <FaFacebookF />
                                        </div>
                                    </a>
                                )}

                                {author?.social?.instagram && (
                                    <a href={fixUrl(author.social.instagram)} target="_blank" rel="noopener noreferrer">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-pink-500 transition">
                                            <FaInstagram />
                                        </div>
                                    </a>
                                )}

                                {author?.social?.twitter && (
                                    <a href={fixUrl(author.social.twitter)} target="_blank" rel="noopener noreferrer">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-sky-500 transition">
                                            <FaTwitter />
                                        </div>
                                    </a>
                                )}

                                {author?.social?.youtube && (
                                    <a href={fixUrl(author.social.youtube)} target="_blank" rel="noopener noreferrer">
                                        <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-red-500 transition">
                                            <FaYoutube />
                                        </div>
                                    </a>
                                )}

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {/* 🔥 BLOG LIST */}
            <div className="max-w-6xl mx-auto p-6">

                <h2 className="text-xl font-semibold mb-4">
                    Blogs by {author.name}
                </h2>

                {blogs.length === 0 ? (
                    <p className="text-gray-500">No blogs yet</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-5">
                        {blogs.map((b) => (
                            <BlogCard key={b._id} blog={b} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default SingleAuthor;