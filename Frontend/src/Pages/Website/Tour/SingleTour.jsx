import React, {
    useEffect,
    useState,
} from "react";

import {
    useParams,
} from "react-router-dom";

import {
    FaCalendarAlt,
    FaUsers,
    FaMoneyBillWave,
    FaClock,
    FaArrowRight,
    FaMapMarkerAlt,
    FaTimes,
    FaCheckCircle,
    FaMinus,
    FaPlus,
    FaBookOpen,
} from "react-icons/fa";

const API =
    "http://localhost:3000/api";

const SingleTour = () => {

    const { id } =
        useParams();

    const [tour, setTour] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showModal,
        setShowModal] =
        useState(false);

    const [packageType,
        setPackageType] =
        useState("single");

    const [quantity,
        setQuantity] =
        useState(1);

    // ================= FETCH =================
    useEffect(() => {

        const fetchTour =
            async () => {

                try {

                    const res =
                        await fetch(
                            `${API}/tours/${id}`
                        );

                    const data =
                        await res.json();

                    if (data.success) {

                        setTour(
                            data.data
                        );
                    }

                } catch (err) {

                    console.log(err);

                } finally {

                    setLoading(false);

                }
            };

        fetchTour();

    }, [id]);

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

    // ================= TOUR DAYS =================
    const getTourDays = (
        start,
        end
    ) => {

        const s =
            new Date(start);

        const e =
            new Date(end);

        const diff =
            e - s;

        return Math.ceil(
            diff /
            (1000 *
                60 *
                60 *
                24)
        );
    };

    // ================= PERSON =================
    const getPersonCount =
        () => {

            if (
                packageType ===
                "single"
            )
                return 1;

            if (
                packageType ===
                "couple"
            )
                return 2;

            return 4;
        };

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Loading...
            </div>
        );
    }

    if (!tour) {

        return (
            <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
                Tour Not Found
            </div>
        );
    }

    // ================= BOOKING =================
    const bookedSeats =
        tour.bookedSeats || 0;

    const remainingSeats =
        tour.maxPeople -
        bookedSeats;

    const totalTravelers =
        quantity *
        getPersonCount();

    const totalPrice =
        quantity *
        (
            tour.packages?.[
            packageType
            ] || 0
        );

    // ================= PAYMENT =================
    const handleConfirmBooking =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const res =
                    await fetch(
                        `${API}/payment/create-tour-payment`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,
                            },

                            body: JSON.stringify({
                                tourId:
                                    tour._id,

                                packageType,

                                quantity,

                                travelers:
                                    totalTravelers,

                                amount:
                                    totalPrice,
                            }),
                        }
                    );

                const data =
                    await res.json();

                console.log(data);

                if (
                    data.success &&
                    data.url
                ) {

                    window.location.href =
                        data.url;

                } else {

                    alert(
                        data.message ||
                        "Payment failed"
                    );
                }

            } catch (err) {

                console.log(err);

                alert(
                    err.message
                );
            }
        };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-20">

            {/* HERO */}
            <div className="relative h-[450px] overflow-hidden">

                <img
                    src={`http://localhost:3000/${tour.thumbnailDetails}`}
                    className="w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]"></div>

                {/* CONTENT */}
                <div className="absolute inset-0 flex items-center">

                    <div className="max-w-7xl mx-auto px-6 w-full">

                        <div className="max-w-4xl text-white">

                            {/* DAYS LEFT */}
                            <div
                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold mb-6
                                ${getDaysLeft(
                                    tour.startDate
                                ) <= 7
                                        ? "bg-red-500"
                                        : "bg-[#32AEBB]"
                                    }`}
                            >

                                <FaClock />

                                {
                                    getDaysLeft(
                                        tour.startDate
                                    )
                                } Days Left

                            </div>

                            {/* TITLE */}
                            <h1 className="text-7xl font-black leading-tight mb-8">

                                {
                                    tour.title
                                }

                            </h1>

                        </div>

                    </div>

                </div>

            </div>

            {/* MAIN */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">

                {/* INFO CARDS */}
                <div className="grid grid-cols-4 gap-6 mb-14">

                    {/* START DATE */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <div className="bg-[#32AEBB]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#32AEBB] text-2xl mb-5">

                            <FaCalendarAlt />

                        </div>

                        <p className="text-gray-500 mb-2">
                            Duration
                        </p>

                        <h3 className="text-lg font-bold">

                            {
                                new Date(
                                    tour.startDate
                                ).toLocaleDateString()
                            } - {
                                new Date(
                                    tour.endDate
                                ).toLocaleDateString()
                            }

                        </h3>

                    </div>

                    {/* TOUR DAYS */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <div className="bg-[#32AEBB]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#32AEBB] text-2xl mb-5">

                            <FaClock />

                        </div>

                        <p className="text-gray-500 mb-2">
                            Tour Duration
                        </p>

                        <h3 className="text-2xl font-bold">

                            {
                                getTourDays(
                                    tour.startDate,
                                    tour.endDate
                                )
                            } Days

                        </h3>

                    </div>

                    {/* REMAINING */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <div className="bg-[#32AEBB]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#32AEBB] text-2xl mb-5">

                            <FaUsers />

                        </div>

                        <p className="text-gray-500 mb-2">
                            Remaining Seats
                        </p>

                        <h3 className="text-2xl font-bold">

                            {
                                remainingSeats
                            }

                        </h3>

                    </div>

                    {/* PRICE */}
                    <div className="bg-white rounded-3xl shadow-xl p-8">

                        <div className="bg-[#32AEBB]/10 w-16 h-16 rounded-2xl flex items-center justify-center text-[#32AEBB] text-2xl mb-5">

                            <FaMoneyBillWave />

                        </div>

                        <p className="text-gray-500 mb-2">
                            Starting Price
                        </p>

                        <h3 className="text-2xl font-bold text-[#32AEBB]">

                            ৳
                            {
                                tour.packages
                                    ?.single
                            }

                        </h3>

                    </div>

                </div>

                {/* DESCRIPTION */}
                <div className="bg-white rounded-3xl shadow-xl p-10 mb-14">

                    <h2 className="text-4xl font-bold mb-8">
                        Tour Description
                    </h2>

                    <p className="text-gray-600 leading-10 text-lg">

                        {
                            tour.description
                        }

                    </p>

                </div>

                {/* PACKAGES */}
                <div className="bg-white rounded-3xl shadow-xl p-10 mb-14">

                    <h2 className="text-4xl font-bold mb-8">
                        Select Package
                    </h2>

                    {/* PACKAGE CARD */}
                    <div className="grid grid-cols-3 gap-8 mb-10">

                        {/* SINGLE */}
                        <div
                            onClick={() =>
                                setPackageType(
                                    "single"
                                )
                            }
                            className={`border-2 rounded-3xl p-8 cursor-pointer transition
                            ${packageType ===
                                    "single"
                                    ? "border-[#32AEBB] bg-[#32AEBB]/5"
                                    : "border-gray-200"
                                }`}
                        >

                            <h3 className="text-3xl font-bold mb-4">
                                Single
                            </h3>

                            <p className="text-gray-500 mb-5">
                                1 Person
                            </p>

                            <h4 className="text-4xl font-black text-[#32AEBB]">

                                ৳
                                {
                                    tour.packages
                                        ?.single
                                }

                            </h4>

                        </div>

                        {/* COUPLE */}
                        <div
                            onClick={() =>
                                setPackageType(
                                    "couple"
                                )
                            }
                            className={`border-2 rounded-3xl p-8 cursor-pointer transition
                            ${packageType ===
                                    "couple"
                                    ? "border-[#32AEBB] bg-[#32AEBB]/5"
                                    : "border-gray-200"
                                }`}
                        >

                            <h3 className="text-3xl font-bold mb-4">
                                Couple
                            </h3>

                            <p className="text-gray-500 mb-5">
                                2 Persons
                            </p>

                            <h4 className="text-4xl font-black text-[#32AEBB]">

                                ৳
                                {
                                    tour.packages
                                        ?.couple
                                }

                            </h4>

                        </div>

                        {/* FAMILY */}
                        <div
                            onClick={() =>
                                setPackageType(
                                    "family"
                                )
                            }
                            className={`border-2 rounded-3xl p-8 cursor-pointer transition
                            ${packageType ===
                                    "family"
                                    ? "border-[#32AEBB] bg-[#32AEBB]/5"
                                    : "border-gray-200"
                                }`}
                        >

                            <h3 className="text-3xl font-bold mb-4">
                                Family
                            </h3>

                            <p className="text-gray-500 mb-5">
                                4 Persons
                            </p>

                            <h4 className="text-4xl font-black text-[#32AEBB]">

                                ৳
                                {
                                    tour.packages
                                        ?.family
                                }

                            </h4>

                        </div>

                    </div>

                    {/* QUANTITY */}
                    <div className="mb-10">

                        <label className="block text-2xl font-bold mb-6">
                            Select Quantity
                        </label>

                        <div className="bg-[#F8FAFC] border border-gray-200 rounded-3xl p-6">

                            {/* CONTROLLER */}
                            <div className="flex items-center justify-between">

                                {/* LEFT */}
                                <div>

                                    <h3 className="text-xl font-bold mb-2">
                                        Package Quantity
                                    </h3>

                                    <p className="text-gray-500">
                                        Choose how many packages you want to book
                                    </p>

                                </div>

                                {/* BUTTONS */}
                                <div className="flex items-center gap-5">

                                    {/* MINUS */}
                                    <button
                                        onClick={() =>
                                            quantity > 1 &&
                                            setQuantity(
                                                quantity - 1
                                            )
                                        }
                                        className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-white
                        border
                        shadow-sm
                        flex
                        items-center
                        justify-center
                        text-lg
                        hover:bg-gray-100
                        transition
                    "
                                    >

                                        <FaMinus />

                                    </button>

                                    {/* QTY */}
                                    <div
                                        className="
                        min-w-[90px]
                        h-16
                        rounded-2xl
                        bg-[#32AEBB]
                        text-white
                        flex
                        items-center
                        justify-center
                        text-3xl
                        font-black
                        shadow-lg
                    "
                                    >

                                        {quantity}

                                    </div>

                                    {/* PLUS */}
                                    <button
                                        onClick={() => {

                                            if (
                                                totalTravelers +
                                                getPersonCount() <=
                                                remainingSeats
                                            ) {

                                                setQuantity(
                                                    quantity + 1
                                                );
                                            }
                                        }}
                                        className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-[#32AEBB]
                        text-white
                        flex
                        items-center
                        justify-center
                        text-lg
                        hover:bg-[#2897a4]
                        transition
                    "
                                    >

                                        <FaPlus />

                                    </button>

                                </div>

                            </div>

                            {/* INFO */}
                            <div className="grid grid-cols-3 gap-5 mt-8">

                                {/* TRAVELERS */}
                                <div className="bg-white rounded-2xl p-5 border">

                                    <p className="text-gray-500 mb-2">
                                        Total Travelers
                                    </p>

                                    <h3 className="text-3xl font-black">
                                        {totalTravelers}
                                    </h3>

                                </div>

                                {/* SEATS */}
                                <div className="bg-white rounded-2xl p-5 border">

                                    <p className="text-gray-500 mb-2">
                                        Remaining Seats
                                    </p>

                                    <h3 className="text-3xl font-black text-[#32AEBB]">
                                        {remainingSeats}
                                    </h3>

                                </div>

                                {/* PRICE */}
                                <div className="bg-white rounded-2xl p-5 border">

                                    <p className="text-gray-500 mb-2">
                                        Total Price
                                    </p>

                                    <h3 className="text-3xl font-black text-[#32AEBB]">
                                        ৳{totalPrice}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={() =>
                            setShowModal(
                                true
                            )
                        }
                        disabled={
                            totalTravelers >
                            remainingSeats
                        }
                        className="bg-[#32AEBB] hover:bg-[#2897a4] disabled:bg-gray-300 text-white px-10 py-5 rounded-2xl text-lg font-semibold flex items-center gap-3 transition"
                    >

                        Book Now

                        <FaArrowRight />

                    </button>

                </div>

                {/* RELATED PLACES */}
                <div className="mb-14">

                    <div className="flex items-center gap-3 mb-8">

                        <FaMapMarkerAlt className="text-[#32AEBB] text-3xl" />

                        <h2 className="text-4xl font-bold">
                            Related Places
                        </h2>

                    </div>

                    <div className="grid grid-cols-3 gap-8">

                        {
                            tour.places?.map(
                                (place) => (

                                    <div
                                        key={
                                            place._id
                                        }
                                        className="bg-white rounded-3xl overflow-hidden shadow-xl"
                                    >

                                        <img
                                            src={`http://localhost:3000/${place.thumbnailCard}`}
                                            className="h-64 w-full object-cover"
                                        />

                                        <div className="p-6">

                                            <h3 className="text-2xl font-bold mb-2">

                                                {
                                                    place.title
                                                }

                                            </h3>

                                            <p className="text-gray-500">

                                                {
                                                    place.location
                                                }
                                                ,
                                                {" "}
                                                {
                                                    place.country
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )
                        }

                    </div>

                </div>

            </div>

            {/* MODAL */}
            {
                showModal && (

                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">

                        <div className="bg-white w-full max-w-2xl rounded-3xl p-10 relative">

                            {/* CLOSE */}
                            <button
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                                className="absolute top-5 right-5 text-2xl text-gray-500"
                            >

                                <FaTimes />

                            </button>

                            {/* TITLE */}
                            <h2 className="text-4xl font-bold mb-10">
                                Booking Invoice
                            </h2>

                            {/* INFO */}
                            <div className="space-y-5 mb-10">

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Tour
                                    </span>

                                    <span className="font-semibold">
                                        {
                                            tour.title
                                        }
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Package
                                    </span>

                                    <span className="font-semibold capitalize">
                                        {
                                            packageType
                                        }
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Quantity
                                    </span>

                                    <span className="font-semibold">

                                        {
                                            quantity
                                        }

                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Travelers
                                    </span>

                                    <span className="font-semibold">

                                        {
                                            totalTravelers
                                        }

                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Tour Date
                                    </span>

                                    <span className="font-semibold">

                                        {
                                            new Date(
                                                tour.startDate
                                            ).toLocaleDateString()
                                        }

                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Total
                                    </span>

                                    <span className="text-3xl font-black text-[#32AEBB]">

                                        ৳
                                        {
                                            totalPrice
                                        }

                                    </span>

                                </div>

                            </div>

                            {/* BUTTON */}
                            <button
                                type="button"
                                onClick={
                                    handleConfirmBooking
                                }
                                className="w-full bg-[#32AEBB] hover:bg-[#2897a4] text-white py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3 transition"
                            >

                                Confirm Booking

                                <FaCheckCircle />

                            </button>
                            <p className="text-center text-sm text-red-500 mt-5 font-medium">

                                No refund available after booking confirmation.

                            </p>

                        </div>

                    </div>

                )
            }

        </div>
    );
};

export default SingleTour;