import React from "react";

import {
  IoLocationOutline,
} from "react-icons/io5";

import {
  MdOutlineMailOutline,
} from "react-icons/md";

import {
  FaPhoneAlt,
} from "react-icons/fa";

const Contact = () => {

  // ================= SUBMIT =================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const form =
        e.target;

      const name =
        form.name.value;

      const email =
        form.email.value;

      const message =
        form.message.value;

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/messages/create",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                email,
                message,
              }),
            }
          );

        const data =
          await res.json();

        if (data.success) {

          alert(
            "Message Sent Successfully ✅"
          );

          form.reset();
        }

      } catch (err) {

        console.log(err);

        alert(
          "Something went wrong ❌"
        );
      }
    };

  return (
    <div className="bg-gradient-to-br from-[#f0f4f8] to-[#e6f7f9] py-20 min-h-screen">

      <div className="flex flex-col lg:flex-row justify-start items-start gap-12 w-11/12 max-w-7xl mx-auto">

        {/* ================= LEFT FORM ================= */}
        <div className="bg-white/70 backdrop-blur-xl w-full lg:w-7/12 p-10 rounded-3xl shadow-lg border border-white/40">

          {/* TITLE */}
          <div className="mb-8">

            <h1 className="text-3xl font-bold text-[#1B4B36]">
              Contact TripSnap
            </h1>

            <p className="text-gray-600 mt-2">

              Reach out for travel guidance, destination insights, or trip planning assistance.

            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-8"
          >

            {/* NAME */}
            <div className="relative">

              <input
                type="text"
                name="name"
                required
                placeholder=" "
                className="peer input-wave"
              />

              <label className="label-wave">
                Your Name
              </label>

            </div>

            {/* EMAIL */}
            <div className="relative">

              <input
                type="email"
                name="email"
                required
                placeholder=" "
                className="peer input-wave"
              />

              <label className="label-wave">
                Email Address
              </label>

            </div>

            {/* MESSAGE */}
            <div className="relative">

              <textarea
                rows={5}
                name="message"
                required
                placeholder=" "
                className="peer input-wave"
              ></textarea>

              <label className="label-wave">
                Your Message
              </label>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#1B4B36] text-white py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-lg"
            >
              Send Message ✉️
            </button>

          </form>

        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="w-full lg:w-5/12">

          {/* MAP */}
          <iframe
            src="https://maps.google.com/maps?q=IUBAT%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="320"
            className="rounded-2xl shadow-md border-0"
            loading="lazy"
          ></iframe>

          {/* INFO CARD */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-md space-y-6">

            {/* LOCATION */}
            <div className="flex gap-3 items-start">

              <IoLocationOutline className="text-2xl text-[#1B4B36]" />

              <div>

                <p className="font-semibold">
                  Campus Location
                </p>

                <p className="text-gray-500 text-sm">
                  IUBAT, Uttara Model Town, Dhaka-1230, Bangladesh
                </p>

              </div>

            </div>

            {/* EMAIL */}
            <div className="flex gap-3 items-start">

              <MdOutlineMailOutline className="text-2xl text-[#1B4B36]" />

              <div>

                <p className="font-semibold">
                  Official Email
                </p>

                <p className="text-gray-500 text-sm">
                  info@tripsnap.com
                </p>

              </div>

            </div>

            {/* PHONE */}
            <div className="flex gap-3 items-start">

              <FaPhoneAlt className="text-xl text-[#1B4B36]" />

              <div>

                <p className="font-semibold">
                  Contact Number
                </p>

                <p className="text-gray-500 text-sm">
                  +880-2-55091801-5
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= STYLE ================= */}
      <style>{`
        .input-wave {
          width: 100%;
          border: none;
          border-bottom: 2px solid #ccc;
          background: transparent;
          padding: 12px 0;
          outline: none;
          font-size: 14px;
          transition: 0.3s ease;
        }

        .input-wave:focus {
          border-bottom: 2px solid #1B4B36;
        }

        .label-wave {
          position: absolute;
          top: 12px;
          left: 0;
          color: #888;
          font-size: 14px;
          transition: 0.3s ease;
          pointer-events: none;
        }

        .input-wave:focus + .label-wave,
        .input-wave:not(:placeholder-shown) + .label-wave {
          top: -12px;
          font-size: 12px;
          color: #1B4B36;
        }

        textarea.input-wave {
          resize: none;
        }
      `}</style>

    </div>
  );
};

export default Contact;