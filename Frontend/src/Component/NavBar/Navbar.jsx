import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import logo from "./asset/logo.png"

const API = "http://localhost:3000/api/users";

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);

    const dropdownRef = useRef(null);
    const location = useLocation();

    const menus = [
        { name: "Home", path: "/tripsnap" },
        { name: "Place", path: "/tripsnap/place" },
        { name: "Blog", path: "/tripsnap/blog" },
        { name: "Contact", path: "/tripsnap/contact" },
        { name: "About", path: "/tripsnap/about" },
    ];


    // 🔥 FETCH LOGGED USER
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const res = await fetch(`${API}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ FIXED
                    },
                });

                const data = await res.json();

                console.log("USER API RESPONSE:", data); // 🔍 debug

                if (data.success) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log("FETCH ERROR:", err);
            }
        };

        fetchUser();
    }, []);

    // 🔥 OUTSIDE CLICK CLOSE
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-[#f8faef] backdrop-blur-md text-white border-b border-[#32AEBB]/30">
            <div className="w-10/12 mx-auto flex items-center justify-between px-6 py-3">

                {/* LEFT */}
                <div className="flex items-center gap-12">

                    <img
                        onClick={() => navigate("/tripsnap")}
                        className="cursor-pointer w-25 scale-200 overflow-hidden"
                        src={logo}
                        alt="" />

                    <div className="hidden md:flex gap-8 text-sm">
                        {menus.map((menu) => {
                            const isActive = location.pathname === menu.path;

                            return (
                                <div
                                    key={menu.name}
                                    onClick={() => navigate(menu.path)}
                                    className="relative group cursor-pointer text-xl"
                                >
                                    <span
                                        className={`transition-all duration-300 ${isActive ? "text-[#F48C3C]" : "text-[#32AEBB]"
                                            }`}
                                    >
                                        {menu.name}
                                    </span>

                                    {/* 🔥 UNDERLINE ANIMATION */}
                                    <span
                                        className={`absolute left-0 -bottom-1 h-[2px] bg-[#F48C3C] transition-all duration-500 
          ${isActive
                                                ? "w-full"
                                                : "w-0 group-hover:w-full group-hover:left-0"
                                            }`}
                                    ></span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT PROFILE */}
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-3 cursor-pointer border-1 border-[#32AEBB] rounded-lg px-3 py-1"
                        >
                            <img
                                src={`http://localhost:3000/${user.image}`}
                                alt="profile"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                            <span className="hidden md:block text-[#32AEBB] text-xl ">{user.name}</span>
                        </div>

                        {open && (
                            <div className="absolute right-0 mt-3 w-40 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                                <div
                                    onClick={() => {
                                        if (user.role === "admin") {
                                            navigate("/dashboard/admin");
                                        } else if (user.role === "traveler") {
                                            navigate("/dashboard/creator");
                                        } else {
                                            navigate("/dashboard/user");
                                        }
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    My Profile
                                </div>

                                <div
                                    onClick={handleLogout}
                                    className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // 🔥 loading placeholder
                    <div className="w-10 h-10 bg-gray-400 rounded-full animate-pulse"></div>
                )}

            </div>
        </div>
    );
};

export default Navbar;