import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaSearch,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkedAlt,
    FaCalendarAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

const API =
    "http://localhost:3000/api";

const Booking = () => {

    const [bookings,
        setBookings] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    const [search,
        setSearch] =
        useState("");

    // ================= FETCH =================
    useEffect(() => {

        const fetchBookings =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );

                    const res =
                        await fetch(
                            `${API}/bookings`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );

                    const data =
                        await res.json();

                    if (data.success) {

                        setBookings(
                            data.data || []
                        );
                    }

                } catch (err) {

                    console.log(err);

                } finally {

                    setLoading(false);

                }
            };

        fetchBookings();

    }, []);

    // ================= FILTER =================
    const filteredBookings =
        useMemo(() => {

            return bookings.filter(
                (booking) => {

                    const keyword =
                        search.toLowerCase();

                    return (

                        booking?.user?.name
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        booking?.user?.email
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        booking?.tour?.title
                            ?.toLowerCase()
                            .includes(keyword)
                    );
                }
            );

        }, [
            bookings,
            search,
        ]);

    // ================= TOTAL =================
    const totalBookings =
        filteredBookings.length;

    const totalRevenue =
        filteredBookings.reduce(
            (
                acc,
                booking
            ) =>
                acc +
                Number(
                    booking.totalAmount
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

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">

                <div>

                    <h2 className="text-4xl font-bold">
                        Booking Management
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Monitor all confirmed bookings
                    </p>

                </div>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-6 mb-10">

                {/* TOTAL */}
                <div className="bg-white rounded-3xl shadow border border-gray-100 p-6">

                    <h3 className="text-4xl font-bold">
                        {
                            totalBookings
                        }
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Total Bookings
                    </p>

                </div>

                {/* REVENUE */}
                <div className="bg-white rounded-3xl shadow border border-gray-100 p-6">

                    <h3 className="text-4xl font-bold text-[#32AEBB]">

                        ৳
                        {
                            totalRevenue
                        }

                    </h3>

                    <p className="text-gray-500 mt-2">
                        Total Revenue
                    </p>

                </div>

            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-3xl shadow border border-gray-100 p-5 mb-10">

                <div className="relative">

                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        placeholder="Search booking by user or tour..."
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

            {/* BOOKING LIST */}
            <div className="space-y-6">

                {filteredBookings.map(
                    (booking) => (

                        <div
                            key={
                                booking._id
                            }
                            className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
                        >

                            <div className="grid grid-cols-3">

                                {/* IMAGE */}
                                <div className="relative">

                                    <img
                                        src={`http://localhost:3000/${booking?.tour?.thumbnailCard}`}
                                        className="h-full w-full object-cover"
                                    />

                                </div>

                                {/* INFO */}
                                <div className="col-span-2 p-8">

                                    {/* TITLE */}
                                    <div className="mb-6">

                                        <h3 className="text-3xl font-bold">

                                            {
                                                booking
                                                    ?.tour
                                                    ?.title
                                            }

                                        </h3>

                                        <p className="text-gray-500 mt-2">

                                            Booking ID:
                                            {" "}
                                            {
                                                booking._id
                                            }

                                        </p>

                                    </div>

                                    {/* USER */}
                                    <div className="grid grid-cols-2 gap-6 mb-8">

                                        {/* NAME */}
                                        <div className="flex items-center gap-4">

                                            <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB]">

                                                <FaUser />

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Traveler
                                                </p>

                                                <h4 className="font-semibold text-lg">

                                                    {
                                                        booking
                                                            ?.user
                                                            ?.name
                                                    }

                                                </h4>

                                            </div>

                                        </div>

                                        {/* EMAIL */}
                                        <div className="flex items-center gap-4">

                                            <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB]">

                                                <FaEnvelope />

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Email
                                                </p>

                                                <h4 className="font-semibold">

                                                    {
                                                        booking
                                                            ?.user
                                                            ?.email
                                                    }

                                                </h4>

                                            </div>

                                        </div>

                                    </div>

                                    {/* DETAILS */}
                                    <div className="grid grid-cols-3 gap-5">

                                        {/* PACKAGE */}
                                        <div className="bg-gray-50 rounded-2xl p-5">

                                            <p className="text-sm text-gray-500 mb-2">
                                                Package
                                            </p>

                                            <h4 className="font-bold capitalize">

                                                {
                                                    booking.packageType
                                                }

                                            </h4>

                                        </div>

                                        {/* DATE */}
                                        <div className="bg-gray-50 rounded-2xl p-5">

                                            <p className="text-sm text-gray-500 mb-2">
                                                Tour Date
                                            </p>

                                            <h4 className="font-bold">

                                                {
                                                    new Date(
                                                        booking
                                                            ?.tour
                                                            ?.startDate
                                                    ).toLocaleDateString()
                                                }

                                            </h4>

                                        </div>

                                        {/* PAYMENT */}
                                        <div className="bg-gray-50 rounded-2xl p-5">

                                            <p className="text-sm text-gray-500 mb-2">
                                                Payment
                                            </p>

                                            <h4 className="font-bold text-[#32AEBB]">

                                                ৳
                                                {
                                                    booking.totalAmount
                                                }

                                            </h4>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )
                )}

            </div>

            {/* EMPTY */}
            {
                filteredBookings.length === 0 && (

                    <div className="bg-white rounded-3xl shadow border border-gray-100 p-20 text-center">

                        <h3 className="text-3xl font-bold mb-3">
                            No Booking Found
                        </h3>

                        <p className="text-gray-500">
                            Try another search keyword
                        </p>

                    </div>

                )
            }

        </div>
    );
};

export default Booking;