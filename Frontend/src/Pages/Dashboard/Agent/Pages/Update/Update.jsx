import React, {
    useEffect,
    useState,
} from "react";

import {
    FaPaperPlane,
    FaCalendarAlt,
    FaUsers,
} from "react-icons/fa";

const Update = () => {

    const [tours, setTours] =
        useState([]);

    const [selectedTour, setSelectedTour] =
        useState(null);

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =====================================
    // FETCH TOURS
    // =====================================

    useEffect(() => {

        fetchTours();

    }, []);

    const fetchTours = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );

            const res =
                await fetch(
                    "http://localhost:3000/api/tours",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            const data =
                await res.json();

            setTours(
                data?.data || []
            );

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================
    // SEND UPDATE
    // =====================================

    const handleSend =
        async () => {

            try {

                if (!message) {

                    return alert(
                        "Please write message"
                    );
                }

                setLoading(true);

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const res =
                    await fetch(
                        "http://localhost:3000/api/tours/send-update",
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
                                    selectedTour._id,

                                message,
                            }),
                        }
                    );

                const data =
                    await res.json();

                if (data.success) {

                    alert(
                        "Update sent successfully"
                    );

                    setMessage("");

                    setSelectedTour(
                        null
                    );

                } else {

                    alert(
                        data.message
                    );
                }

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        };

    return (
        <div className="p-4 md:p-8">

            {/* HEADER */}
            <div className="mb-10">

                <h2 className="text-4xl font-black mb-3">

                    Send Tour Updates

                </h2>

                <p className="text-gray-500 text-lg">

                    Select a tour and send updates
                    to all booked travelers.

                </p>

            </div>

            {/* TOUR LIST */}
            {!selectedTour && (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {tours.map(
                        (tour) => (

                            <div
                                key={
                                    tour._id
                                }
                                onClick={() =>
                                    setSelectedTour(
                                        tour
                                    )
                                }
                                className="
                                    bg-white
                                    rounded-3xl
                                    overflow-hidden
                                    shadow-lg
                                    border
                                    border-gray-100
                                    cursor-pointer
                                    hover:shadow-2xl
                                    hover:-translate-y-1
                                    transition
                                    duration-300
                                "
                            >

                                {/* IMAGE */}
                                <img
                                    src={`http://localhost:3000/${tour.thumbnailCard}`}
                                    className="h-60 w-full object-cover"
                                />

                                {/* CONTENT */}
                                <div className="p-6">

                                    <h3 className="text-2xl font-bold mb-4">

                                        {
                                            tour.title
                                        }

                                    </h3>

                                    {/* INFO */}
                                    <div className="space-y-3">

                                        {/* DATE */}
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3 text-gray-500">

                                                <FaCalendarAlt />

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

                                        {/* SEATS */}
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3 text-gray-500">

                                                <FaUsers />

                                                <span>
                                                    Remaining
                                                </span>

                                            </div>

                                            <span className="font-semibold text-[#32AEBB]">

                                                {
                                                    tour.remainingSeats
                                                }

                                            </span>

                                        </div>

                                    </div>

                                    {/* BUTTON */}
                                    <button
                                        className="
                                            w-full
                                            mt-6
                                            bg-[#32AEBB]
                                            hover:bg-[#2897a4]
                                            text-white
                                            py-4
                                            rounded-2xl
                                            font-bold
                                            transition
                                        "
                                    >

                                        Send Update

                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>
            )}

            {/* UPDATE FORM */}
            {selectedTour && (

                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 max-w-4xl mx-auto">

                    {/* TOP */}
                    <div className="flex items-center gap-5 mb-8">

                        <img
                            src={`http://localhost:3000/${selectedTour.thumbnailCard}`}
                            className="w-36 h-28 rounded-2xl object-cover"
                        />

                        <div>

                            <h3 className="text-3xl font-black mb-2">

                                {
                                    selectedTour.title
                                }

                            </h3>

                            <p className="text-gray-500">

                                Send update to all travelers
                                who booked this tour.

                            </p>

                        </div>

                    </div>

                    {/* MESSAGE */}
                    <div className="mb-8">

                        <label className="block text-xl font-bold mb-4">

                            Write Message

                        </label>

                        <textarea
                            rows={8}
                            value={message}
                            onChange={(e) =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            placeholder="
Hello Travelers,

Tomorrow our tour will start at 8:00 AM.

Meeting Point:
Dhanmondi 27

Please arrive on time.
                            "
                            className="
                                w-full
                                border
                                border-gray-300
                                rounded-3xl
                                px-5
                                py-5
                                outline-none
                                resize-none
                                focus:border-[#32AEBB]
                            "
                        />

                    </div>

                    {/* NOTE */}
                    <div className="bg-[#32AEBB]/10 border border-[#32AEBB]/20 rounded-2xl p-5 mb-8">

                        <p className="text-[#32AEBB] font-medium leading-7">

                            This message will be sent
                            directly to all travelers'
                            email addresses.

                        </p>

                    </div>

                    {/* BUTTONS */}
                    <div className="flex items-center gap-5">

                        {/* BACK */}
                        <button
                            onClick={() =>
                                setSelectedTour(
                                    null
                                )
                            }
                            className="
                                px-8
                                py-4
                                rounded-2xl
                                border
                                font-bold
                            "
                        >

                            Back

                        </button>

                        {/* SEND */}
                        <button
                            onClick={
                                handleSend
                            }
                            disabled={loading}
                            className="
                                bg-[#32AEBB]
                                hover:bg-[#2897a4]
                                text-white
                                px-8
                                py-4
                                rounded-2xl
                                font-bold
                                flex
                                items-center
                                gap-3
                                transition
                            "
                        >

                            <FaPaperPlane />

                            {
                                loading
                                    ? "Sending..."
                                    : "Send Update"
                            }

                        </button>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Update;