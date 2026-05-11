
import React, {
    useEffect,
    useState,
} from "react";
import { FaEnvelope, FaUser } from "react-icons/fa";

const Tours = () => {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    // =====================================
    // FETCH BOOKINGS
    // =====================================

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const res =
                await fetch(
                    "http://localhost:3000/api/bookings",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await res.json();

            setBookings(
                data?.data || []
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    // =====================================
    // FILTER
    // =====================================

    const filteredBookings =
        bookings.filter(
            (booking) => {

                const userName =
                    booking?.user?.name
                        ?.toLowerCase() || "";

                const tourName =
                    booking?.tour?.title
                        ?.toLowerCase() || "";

                return (
                    userName.includes(
                        search.toLowerCase()
                    ) ||
                    tourName.includes(
                        search.toLowerCase()
                    )
                );
            }
        );

    // =====================================
    // TOTAL
    // =====================================

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
                    booking.amount || 0
                ),
            0
        );

    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-[60vh]">

                <h2 className="text-3xl font-bold">
                    Loading...
                </h2>

            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <div>

                    <h2 className="text-4xl font-black mb-2">
                        Tour Bookings
                    </h2>

                    <p className="text-gray-500">
                        Manage all customer bookings
                    </p>

                </div>

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search by user or tour"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    className="border border-gray-300 rounded-2xl px-5 py-3 outline-none w-full lg:w-96"
                />

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                {/* TOTAL BOOKINGS */}
                <div className="bg-white rounded-3xl shadow-md p-8 border">

                    <p className="text-gray-500 mb-3 text-lg">
                        Total Bookings
                    </p>

                    <h2 className="text-5xl font-black text-[#32AEBB]">
                        {totalBookings}
                    </h2>

                </div>

                {/* TOTAL REVENUE */}
                <div className="bg-white rounded-3xl shadow-md p-8 border">

                    <p className="text-gray-500 mb-3 text-lg">
                        Total Revenue
                    </p>

                    <h2 className="text-5xl font-black text-[#32AEBB]">
                        ৳ {totalRevenue}
                    </h2>

                </div>

            </div>

            {/* EMPTY */}
            {filteredBookings.length === 0 ? (

                <div className="bg-white rounded-3xl p-16 text-center border shadow-sm">

                    <h2 className="text-3xl font-black mb-3">
                        No Booking Found
                    </h2>

                    <p className="text-gray-500">
                        No customer bookings available.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 gap-8">

                    {filteredBookings.map(
                        (booking) => (

                            <div
                                key={
                                    booking._id
                                }
                                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300"
                            >

                                <div className="grid grid-cols-1 lg:grid-cols-3">

                                    {/* IMAGE */}
                                    <div className="relative">

                                        <img
                                            src={`http://localhost:3000/${booking?.tour?.thumbnailCard}`}
                                            className="h-full w-full object-cover lg:min-h-[420px]"
                                        />

                                        {/* STATUS */}
                                        <div
                                            className={`absolute top-5 right-5 px-4 py-2 rounded-full text-sm font-bold text-white

                            ${booking.paymentStatus === "paid"
                                                    ? "bg-green-500"
                                                    : booking.paymentStatus === "pending"
                                                        ? "bg-yellow-500"
                                                        : booking.paymentStatus === "failed"
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                }
                            `}
                                        >

                                            {
                                                booking.paymentStatus
                                            }

                                        </div>

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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                                            {/* NAME */}
                                            <div className="flex items-center gap-4">

                                                <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-xl">

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

                                                <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-xl">

                                                    <FaEnvelope />

                                                </div>

                                                <div>

                                                    <p className="text-sm text-gray-500">
                                                        Email
                                                    </p>

                                                    <h4 className="font-semibold break-all">

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
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">

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
                                                    } - {
                                                        new Date(
                                                            booking
                                                                ?.tour
                                                                ?.endDate
                                                        ).toLocaleDateString()
                                                    }

                                                </h4>

                                            </div>

                                            {/* PAYMENT */}
                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-sm text-gray-500 mb-2">
                                                    Payment
                                                </p>

                                                <h4 className="font-bold text-[#32AEBB] text-xl">

                                                    ৳
                                                    {
                                                        booking.amount
                                                    }

                                                </h4>

                                            </div>

                                            {/* TRAVELERS */}
                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-sm text-gray-500 mb-2">
                                                    Travelers
                                                </p>

                                                <h4 className="font-bold">

                                                    {
                                                        booking.travelers
                                                    }

                                                </h4>

                                            </div>

                                            {/* QUANTITY */}
                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-sm text-gray-500 mb-2">
                                                    Quantity
                                                </p>

                                                <h4 className="font-bold">

                                                    {
                                                        booking.quantity
                                                    }

                                                </h4>

                                            </div>

                                            {/* BOOK DATE */}
                                            <div className="bg-gray-50 rounded-2xl p-5">

                                                <p className="text-sm text-gray-500 mb-2">
                                                    Booking Date
                                                </p>

                                                <h4 className="font-bold">

                                                    {
                                                        new Date(
                                                            booking.createdAt
                                                        ).toLocaleDateString()
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
            )}

        </div>
    );
};

export default Tours;

