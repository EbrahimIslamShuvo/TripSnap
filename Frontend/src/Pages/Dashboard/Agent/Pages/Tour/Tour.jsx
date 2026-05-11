import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaSearch,
    FaCalendarAlt,
    FaUsers,
    FaMoneyBillWave,
    FaMapMarkedAlt,
} from "react-icons/fa";

const API =
    "http://localhost:3000/api";

const Tour = () => {

    const [tours, setTours] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [monthFilter,
        setMonthFilter] =
        useState("");

    // ================= FETCH =================
    useEffect(() => {

        const fetchTours =
            async () => {

                try {

                    const res =
                        await fetch(
                            `${API}/tours`
                        );

                    const data =
                        await res.json();

                    if (data.success) {

                        setTours(
                            data.data || []
                        );
                    }

                } catch (err) {

                    console.log(err);

                } finally {

                    setLoading(false);

                }
            };

        fetchTours();

    }, []);

    // ================= FILTER =================
    const filteredTours =
        useMemo(() => {

            return tours.filter(
                (tour) => {

                    const matchSearch =
                        tour.title
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const tourMonth =
                        new Date(
                            tour.startDate
                        ).getMonth() + 1;

                    const matchMonth =
                        monthFilter
                            ? tourMonth ===
                            Number(
                                monthFilter
                            )
                            : true;

                    return (
                        matchSearch &&
                        matchMonth
                    );
                }
            );

        }, [
            tours,
            search,
            monthFilter,
        ]);

    // ================= STATS =================
    const totalTours =
        filteredTours.length;

    const totalSeats =
        filteredTours.reduce(
            (
                acc,
                tour
            ) =>
                acc +
                Number(
                    tour.maxPeople
                ),
            0
        );

    if (loading) {

        return (
            <div className="p-10">
                Loading...
            </div>
        );
    }

    // ================= HELPERS =================

    // 🔥 DAYS LEFT
    const getDaysLeft = (date) => {

        const today =
            new Date();

        const start =
            new Date(date);

        const diff =
            start - today;

        return Math.ceil(
            diff / (1000 * 60 * 60 * 24)
        );
    };

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">

                <div>

                    <h2 className="text-4xl font-bold">
                        Tour Monitoring
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Monitor all launched tours and seat capacity
                    </p>

                </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mb-10">

                {/* TOTAL TOURS */}
                <div className="bg-white rounded-3xl p-6 shadow border border-gray-100">

                    <div className="flex items-center justify-between mb-4">

                        <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-2xl">

                            <FaMapMarkedAlt />

                        </div>

                    </div>

                    <h3 className="text-4xl font-bold">
                        {totalTours}
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Total Tours
                    </p>

                </div>

                {/* TOTAL SEATS */}
                <div className="bg-white rounded-3xl p-6 shadow border border-gray-100">

                    <div className="flex items-center justify-between mb-4">

                        <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-2xl">

                            <FaUsers />

                        </div>

                    </div>

                    <h3 className="text-4xl font-bold">
                        {totalSeats}
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Total Seat Capacity
                    </p>

                </div>

                {/* MONTH */}
                <div className="bg-white rounded-3xl p-6 shadow border border-gray-100">

                    <div className="flex items-center justify-between mb-4">

                        <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-2xl">

                            <FaCalendarAlt />

                        </div>

                    </div>

                    <h3 className="text-4xl font-bold">

                        {
                            monthFilter
                                ? filteredTours.length
                                : "All"
                        }

                    </h3>

                    <p className="text-gray-500 mt-2">
                        Tours This Month
                    </p>

                </div>

            </div>

            {/* FILTER */}
            <div className="bg-white rounded-3xl shadow border border-gray-100 p-5 mb-10">

                <div className="grid grid-cols-1 gap-5">

                    {/* SEARCH */}
                    <div className="relative">

                        <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search tours..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#32AEBB]"
                        />

                    </div>

                </div>

            </div>

            {/* TOUR LIST */}
            <div className="grid grid-cols-3 gap-8">

                {filteredTours.map(
                    (tour) => (

                        <div
                            key={
                                tour._id
                            }
                            className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300"
                        >

                            {/* IMAGE */}
                            <div className="relative">

                                <img
                                    src={`http://localhost:3000/${tour.thumbnailCard}`}
                                    className="h-60 w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 text-white">

                                    <h3 className="text-2xl font-bold">
                                        {
                                            tour.title
                                        }
                                    </h3>

                                </div>

                            </div>

                            {/* CONTENT */}
                            <div className="p-6">

                                {/* DESCRIPTION */}
                                <p className="text-gray-600 text-sm leading-7 mb-6 line-clamp-3">

                                    {
                                        tour.description
                                            ?.length >
                                            120
                                            ? tour.description.slice(
                                                0,
                                                120
                                            ) +
                                            "..."
                                            : tour.description
                                    }

                                </p>

                                {/* INFO */}
                                <div className="space-y-4">

                                    {/* START DATE */}
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

                                    {/* DAYS LEFT */}
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3 text-gray-500">

                                            <FaCalendarAlt className="text-[#32AEBB]" />

                                            <span>
                                                Days Left
                                            </span>

                                        </div>

                                        <span
                                            className={`font-semibold
            ${getDaysLeft(
                                                tour.startDate
                                            ) <= 7
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                                }`}
                                        >

                                            {
                                                getDaysLeft(
                                                    tour.startDate
                                                )
                                            } Days

                                        </span>

                                    </div>

                                    {/* TOTAL SEATS */}
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3 text-gray-500">

                                            <FaUsers className="text-[#32AEBB]" />

                                            <span>
                                                Total Seats
                                            </span>

                                        </div>

                                        <span className="font-semibold">

                                            {
                                                tour.maxPeople
                                            }

                                        </span>

                                    </div>

                                    {/* REMAINING SEATS */}
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3 text-gray-500">

                                            <FaUsers className="text-[#32AEBB]" />

                                            <span>
                                                Remaining Seats
                                            </span>

                                        </div>

                                        <span
                                            className={`font-semibold
            ${tour.remainingSeats <= 5
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                                }`}
                                        >

                                            {
                                                tour.remainingSeats
                                            } Seats

                                        </span>

                                    </div>

                                    {/* PRICE */}
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3 text-gray-500">

                                            <FaMoneyBillWave className="text-[#32AEBB]" />

                                            <span>
                                                Starting Price
                                            </span>

                                        </div>

                                        <span className="font-semibold text-[#32AEBB]">

                                            ৳
                                            {
                                                tour.packages
                                                    ?.single
                                            }

                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

            {/* EMPTY */}
            {filteredTours.length ===
                0 && (

                    <div className="bg-white rounded-3xl p-16 text-center shadow border border-gray-100 mt-10">

                        <h3 className="text-2xl font-bold mb-3">
                            No Tours Found
                        </h3>

                        <p className="text-gray-500">
                            Try another search or filter
                        </p>

                    </div>

                )}

        </div>
    );
};

export default Tour;