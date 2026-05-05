import React from 'react';
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-br from-[#f0f4f8] to-[#e6f7f9] py-20">

      <div className="flex justify-start items-start gap-12 w-8/12 mx-auto">

        {/* LEFT FORM */}
        <div className="bg-white/70 backdrop-blur-xl w-7/12 p-10 rounded-3xl shadow-lg border border-white/40">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1B4B36]">
              Contact TripSap
            </h1>
            <p className="text-gray-600 mt-2">
              Reach out for travel guidance, destination insights, or trip planning assistance.
            </p>
          </div>

          <div className="space-y-8">

            {/* NAME */}
            <div className="relative">
              <input type="text" required placeholder=" " className="peer input-wave" />
              <label className="label-wave">Your Name</label>
            </div>

            {/* EMAIL + PHONE */}
            <div className="flex gap-6">
              <div className="relative w-full">
                <input type="email" required placeholder=" " className="peer input-wave" />
                <label className="label-wave">Email Address</label>
              </div>

              
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <textarea rows={4} required placeholder=" " className="peer input-wave"></textarea>
              <label className="label-wave">Your Message</label>
            </div>

            {/* BUTTON */}
            <button className="w-full bg-[#1B4B36] text-white py-3 rounded-xl hover:scale-[1.02] transition">
              Send Message ✉️
            </button>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-6/12">

          {/* ✅ FIXED GOOGLE MAP */}
          <iframe
            src="https://maps.google.com/maps?q=IUBAT%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="320"
            className="rounded-2xl shadow-md"
            loading="lazy"
          ></iframe>

          {/* INFO CARD */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-md space-y-5">

            <div className="flex gap-3 items-start">
              <IoLocationOutline className="text-2xl text-[#1B4B36]" />
              <div>
                <p className="font-semibold">Campus Location</p>
                <p className="text-gray-500 text-sm">
                  IUBAT, Uttara Model Town, Dhaka-1230, Bangladesh
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <MdOutlineMailOutline className="text-2xl text-[#1B4B36]" />
              <div>
                <p className="font-semibold">Official Email</p>
                <p className="text-gray-500 text-sm">
                  info@tripsnap.com
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <FaPhoneAlt className="text-xl text-[#1B4B36]" />
              <div>
                <p className="font-semibold">Contact Number</p>
                <p className="text-gray-500 text-sm">
                  +880-2-55091801-5
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 🔥 WAVE INPUT STYLE */}
      <style>{`
        .input-wave {
          width: 100%;
          border: none;
          border-bottom: 2px solid #ccc;
          background: transparent;
          padding: 10px 0;
          outline: none;
          font-size: 14px;
        }

        .input-wave:focus {
          border-bottom: 2px solid #1B4B36;
        }

        .label-wave {
          position: absolute;
          top: 10px;
          left: 0;
          color: #888;
          font-size: 14px;
          transition: 0.3s ease;
        }

        .input-wave:focus + .label-wave,
        .input-wave:not(:placeholder-shown) + .label-wave {
          top: -12px;
          font-size: 12px;
          color: #1B4B36;
        }
      `}</style>

    </div>
  );
};

export default Contact;