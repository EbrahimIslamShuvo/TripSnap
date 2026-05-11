import React, {
    useEffect,
    useState,
} from "react";

const MyTour = () => {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        fetchMyTours();

    }, []);

    // ==========================================
    // FETCH MY TOURS
    // ==========================================

    const fetchMyTours = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const res =
                await fetch(
                    "http://localhost:3000/api/bookings/my",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await res.json();

            console.log(data);

            setBookings(
                data?.data || []
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-[60vh]">

                <div className="text-xl font-bold">
                    Loading...
                </div>

            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="p-4 md:p-8">

            {/* TITLE */}

            <div className="mb-8">

                <h2 className="text-4xl font-bold">
                    My Tours
                </h2>

                <p className="text-gray-500 mt-2">
                    All your booked tours are here.
                </p>

            </div>

            {/* EMPTY */}

            {bookings.length === 0 ? (

                <div className="bg-white rounded-2xl border p-10 text-center shadow-sm">

                    <h3 className="text-2xl font-bold mb-2">
                        No Tours Found
                    </h3>

                    <p className="text-gray-500">
                        You have not booked any tours yet.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {bookings.map((booking) => (

                        <div
                            key={booking?._id}
                            className="bg-white rounded-3xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300"
                        >

                            {/* IMAGE */}

                            <div className="relative">

                                <img
                                    src={
                                        booking?.tour?.thumbnailCard
                                    }
                                    alt={
                                        booking?.tour?.title
                                    }
                                    className="w-full h-60 object-cover"
                                />

                                {/* PAYMENT STATUS */}

                                <div
                                    className={`absolute top-4 right-4 px-4 py-1 rounded-full text-sm font-bold text-white
                                    
                                    ${booking?.paymentStatus ===
                                            "paid"
                                            ? "bg-green-500"
                                            : booking?.paymentStatus ===
                                                "pending"
                                                ? "bg-yellow-500"
                                                : booking?.paymentStatus ===
                                                    "failed"
                                                    ? "bg-red-500"
                                                    : "bg-gray-500"
                                        }
                                    
                                    `}
                                >
                                    {
                                        booking?.paymentStatus
                                    }
                                </div>
                            </div>

                            {/* CONTENT */}

                            <div className="p-5 space-y-4">

                                {/* TITLE */}

                                <div>

                                    <h3 className="text-2xl font-bold">
                                        {
                                            booking?.tour?.title
                                        }
                                    </h3>

                                </div>

                                {/* INFO */}

                                <div className="space-y-3 text-sm">

                                    {/* DURATION */}

                                    <div className="flex justify-between">

                                        <span className="font-medium text-gray-600">
                                            Duration
                                        </span>

                                        <span className="font-semibold">
                                            {
                                                booking?.tour?.startDate
                                                    ? new Date(booking.tour.startDate).toLocaleDateString()
                                                    : "N/A"
                                            }
                                        </span>
                                    </div>

                                    {/* PACKAGE */}

                                    <div className="flex justify-between">

                                        <span className="font-medium text-gray-600">
                                            Package
                                        </span>

                                        <span className="font-semibold">
                                            {
                                                booking?.packageType
                                            }
                                        </span>
                                    </div>

                                    {/* TRAVELERS */}

                                    <div className="flex justify-between">

                                        <span className="font-medium text-gray-600">
                                            Travelers
                                        </span>

                                        <span className="font-semibold">
                                            {
                                                booking?.travelers
                                            } Person
                                        </span>
                                    </div>

                                    {/* QUANTITY */}

                                    <div className="flex justify-between">

                                        <span className="font-medium text-gray-600">
                                            Seats
                                        </span>

                                        <span className="font-semibold">
                                            {
                                                booking?.quantity
                                            }
                                        </span>
                                    </div>

                                    {/* TOTAL COST */}

                                    <div className="flex justify-between">

                                        <span className="font-medium text-gray-600">
                                            Total Cost
                                        </span>

                                        <span className="font-bold text-primary">
                                            ৳ {
                                                booking?.amount
                                            }
                                        </span>
                                    </div>

                                </div>

                                {/* TRANSACTION */}

                                {booking?.transactionId && (

                                    <div className="pt-3 border-t text-xs text-gray-500 break-all">

                                        <span className="font-semibold">
                                            TXN:
                                        </span>{" "}

                                        {
                                            booking?.transactionId
                                        }

                                    </div>
                                )}

                                {/* BOOK DATE */}

                                <div className="pt-3 border-t text-xs text-gray-500">

                                    Booked At:{" "}

                                    {
                                        new Date(
                                            booking?.createdAt
                                        ).toLocaleDateString()
                                    }

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTour;