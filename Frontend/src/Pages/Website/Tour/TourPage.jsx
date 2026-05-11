import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaSearch,
    FaSortAmountDown,
} from "react-icons/fa";
import TourCard from "../../../Component/Card/TourCard";

const API =
    "http://localhost:3000/api";

const TourPage = () => {

    const [tours, setTours] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [sortBy, setSortBy] =
        useState("days");

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

    // ================= DAYS LEFT =================
    const getDaysLeft = (
        startDate
    ) => {

        const today =
            new Date();

        const start =
            new Date(startDate);

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

    // ================= FILTER + SORT =================
    const filteredTours =
        useMemo(() => {

            // 🔥 REMOVE EXPIRED
            let filtered =
                tours.filter(
                    (tour) =>
                        getDaysLeft(
                            tour.startDate
                        ) >= 0
                );

            // 🔥 SEARCH
            filtered =
                filtered.filter(
                    (tour) =>

                        tour.title
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            )
                );

            // 🔥 SORT
            if (
                sortBy === "days"
            ) {

                filtered.sort(
                    (a, b) =>

                        getDaysLeft(
                            a.startDate
                        ) -

                        getDaysLeft(
                            b.startDate
                        )
                );
            }

            if (
                sortBy === "low-price"
            ) {

                filtered.sort(
                    (a, b) =>

                        a.packages
                            ?.single -

                        b.packages
                            ?.single
                );
            }

            if (
                sortBy === "high-price"
            ) {

                filtered.sort(
                    (a, b) =>

                        b.packages
                            ?.single -

                        a.packages
                            ?.single
                );
            }

            return filtered;

        }, [
            tours,
            search,
            sortBy,
        ]);

    if (loading) {

        return (
            <div className="p-20 text-center text-2xl font-semibold">
                Loading Tours...
            </div>
        );
    }

    return (
        <div className="bg-[#F8FAFC] min-h-screen">

            {/* HERO */}
            <div className="relative h-[500px] overflow-hidden">

                {/* BG IMAGE */}
                <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* CONTENT */}
                <div className="relative z-10 h-full flex items-center justify-center px-6">

                    <div className="max-w-4xl text-center text-white">

                        <h1 className="text-6xl font-black mb-6 leading-tight">

                            Explore Amazing
                            <br />
                            Tour Packages

                        </h1>

                        <p className="text-xl text-gray-200 leading-9 max-w-2xl mx-auto">

                            Discover upcoming adventures, premium travel experiences and unforgettable destinations from top travel agents.

                        </p>

                    </div>

                </div>

            </div>

            {/* FILTER */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5">

                    <div className="grid grid-cols-2 gap-5">

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
                                className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#32AEBB]"
                            />

                        </div>

                        {/* SORT */}
                        <div className="relative">

                            <FaSortAmountDown className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-[#32AEBB]"
                            >

                                <option value="days">
                                    Sort By Days Left
                                </option>

                                <option value="low-price">
                                    Price Low To High
                                </option>

                                <option value="high-price">
                                    Price High To Low
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            </div>

            {/* TOURS */}
            <div className="max-w-7xl mx-auto px-6 py-16">

                {
                    filteredTours.length > 0 ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {
                                filteredTours.map(
                                    (tour) => (

                                        <TourCard
                                            key={
                                                tour._id
                                            }
                                            tour={
                                                tour
                                            }
                                        />

                                    )
                                )
                            }

                        </div>

                    ) : (

                        <div className="bg-white rounded-3xl shadow border border-gray-100 p-20 text-center">

                            <h2 className="text-4xl font-bold mb-4">
                                No Tours Found
                            </h2>

                            <p className="text-gray-500 text-lg">
                                Try another search or sorting option.
                            </p>

                        </div>

                    )
                }

            </div>

        </div>
    );
};

export default TourPage;