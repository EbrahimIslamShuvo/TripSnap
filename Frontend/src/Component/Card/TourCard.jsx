import React from "react";

import {
    FaCalendarAlt,
    FaClock,
    FaUsers,
    FaMapMarkerAlt,
    FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

const TourCard = ({ tour }) => {

    // ================= DAYS LEFT =================
    const getDaysLeft = (
        date
    ) => {

        const today =
            new Date();

        const start =
            new Date(date);

        const diff =
            start - today;

        return Math.ceil(
            diff /
            (1000 *
                60 *
                60 *
                24)
        );
    };

    const daysLeft =
        getDaysLeft(
            tour.startDate
        );

    return (
        <div className="bg-white rounded-[30px] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 group">

            {/* IMAGE */}
            <div className="relative overflow-hidden">

                <img
                    src={`http://localhost:3000/${tour.thumbnailCard}`}
                    className="h-72 w-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* DAYS LEFT */}
                <div
                    className={`absolute top-5 right-5 px-4 py-2 rounded-full text-sm font-semibold text-white
                    ${
                        daysLeft <= 7
                            ? "bg-red-500"
                            : "bg-[#32AEBB]"
                    }`}
                >

                    {daysLeft} Days Left

                </div>

                {/* TITLE */}
                <div className="absolute bottom-5 left-5 text-white">

                    <h2 className="text-3xl font-bold mb-2 leading-tight">

                        {
                            tour.title
                        }

                    </h2>

                </div>

            </div>

            {/* CONTENT */}
            <div className="p-6">

                {/* DESCRIPTION */}
                <p className="text-gray-600 leading-7 mb-7">

                    {
                        tour.description
                            ?.length > 120

                            ? tour.description.slice(
                                0,
                                120
                            ) + "..."

                            : tour.description
                    }

                </p>

                {/* INFO */}
                <div className="space-y-4 mb-8">

                    {/* DATE */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-gray-500">

                            <FaCalendarAlt className="text-[#32AEBB]" />

                            <span>
                                Start Date
                            </span>

                        </div>

                        <span className="font-semibold">

                            {
                                new Date(
                                    tour.startDate
                                ).toLocaleDateString()
                            }

                        </span>

                    </div>

                    {/* SEAT */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-gray-500">

                            <FaUsers className="text-[#32AEBB]" />

                            <span>
                                Seats Left
                            </span>

                        </div>

                        <span
                            className={`font-semibold
                            ${
                                tour.remainingSeats <= 5
                                    ? "text-red-500"
                                    : "text-green-600"
                            }`}
                        >

                            {
                                tour.remainingSeats
                            }

                        </span>

                    </div>

                    {/* PRICE */}
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3 text-gray-500">

                            <FaClock className="text-[#32AEBB]" />

                            <span>
                                Starting From
                            </span>

                        </div>

                        <span className="text-[#32AEBB] text-xl font-bold">

                            ৳
                            {
                                tour.packages
                                    ?.single
                            }

                        </span>

                    </div>

                </div>

                {/* BUTTON */}
                <Link
                    to={`/tripsnap/tour/${tour._id}`}
                    className="w-full bg-[#32AEBB] hover:bg-[#2897a4] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition"
                >

                    Explore Tour

                    <FaArrowRight />

                </Link>

            </div>

        </div>
    );
};

export default TourCard;