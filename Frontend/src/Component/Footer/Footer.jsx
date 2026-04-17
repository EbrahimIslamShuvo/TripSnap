import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8faef] backdrop-blur-md text-[#32AEBB] border-t border-[#32AEBB]/30">

      <div className="w-10/12 mx-auto py-10 flex flex-col items-center gap-6">

        {/* LOGO */}
        <img
          src={logo}
          alt="logo"
          className="w-32 scale-200 overflow-hidden cursor-pointer"
          onClick={() => navigate("/tripsnap")}
        />

        {/* MENU */}
        <div className="flex gap-6 text-base">
          <span onClick={() => navigate("/tripsnap")} className="cursor-pointer hover:text-[#F48C3C] transition-all duration-300">
            Home
          </span>
          <span onClick={() => navigate("/tripsnap/place")} className="cursor-pointer hover:text-[#F48C3C] transition-all duration-300">
            Place
          </span>
          <span onClick={() => navigate("/tripsnap/blog")} className="cursor-pointer hover:text-[#F48C3C] transition-all duration-300">
            Blog
          </span>
          <span onClick={() => navigate("/tripsnap/contact")} className="cursor-pointer hover:text-[#F48C3C] transition-all duration-300">
            Contact
          </span>
          <span onClick={() => navigate("/tripsnap/about")} className="cursor-pointer hover:text-[#F48C3C] transition-all duration-300">
            About
          </span>
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-4">
          <Icon><FaFacebookF /></Icon>
          <Icon><FaInstagram /></Icon>
          <Icon><FaTwitter /></Icon>
          <Icon><FaYoutube /></Icon>
        </div>

        {/* COPYRIGHT */}
        <p className="text-sm text-[#32AEBB]/70 text-center">
          © {new Date().getFullYear()} TripSnap. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Footer;


// 🔥 ICON COMPONENT
const Icon = ({ children }) => (
  <div className="w-10 h-10 flex items-center justify-center bg-[#32AEBB] text-white rounded-full cursor-pointer hover:bg-[#F48C3C] hover:-translate-y-2 transition-all duration-500">
    {children}
  </div>
);