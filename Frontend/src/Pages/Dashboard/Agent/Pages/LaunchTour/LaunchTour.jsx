import React, {
    useEffect,
    useState,
} from "react";

import {
    FaUpload,
    FaMapMarkedAlt,
    FaPlus,
    FaEdit,
    FaCalendarAlt,
    FaUsers,
    FaMoneyBillWave,
    FaChevronDown,
} from "react-icons/fa";

const API =
    "http://localhost:3000/api";

const LaunchTour = () => {

    // ================= STATE =================
    const [places, setPlaces] =
        useState([]);

    const [tours, setTours] =
        useState([]);

    const [selectedTour,
        setSelectedTour] =
        useState(null);

    const [showForm,
        setShowForm] =
        useState(false);

    const [selectedPlaces,
        setSelectedPlaces] =
        useState([]);

    const [openDropdown,
        setOpenDropdown] =
        useState(false);

    const [preview, setPreview] =
        useState({
            thumbnailCard: "",
            thumbnailDetails: "",
            images: [],
        });

    const [form, setForm] =
        useState({
            title: "",
            description: "",

            single: "",
            couple: "",
            family: "",

            maxPeople: "",

            startDate: "",
            endDate: "",

            thumbnailCard: null,
            thumbnailDetails: null,

            images: [],
        });

    const [loading, setLoading] =
        useState(false);

    const [toast, setToast] =
        useState({
            show: false,
            message: "",
            type: "success",
        });

    // ================= TOAST =================
    const showToast = (
        message,
        type = "success"
    ) => {

        setToast({
            show: true,
            message,
            type,
        });

        setTimeout(() => {

            setToast({
                show: false,
                message: "",
                type: "success",
            });

        }, 3000);
    };

    // ================= FETCH =================
    useEffect(() => {

        fetchPlaces();
        fetchTours();

    }, []);

    // ================= FETCH PLACES =================
    const fetchPlaces =
        async () => {

            try {

                const res =
                    await fetch(
                        `${API}/places/all`
                    );

                const data =
                    await res.json();

                if (data.success) {

                    const activePlaces =
                        data.data.filter(
                            (p) =>
                                p.isActive
                        );

                    setPlaces(
                        activePlaces
                    );
                }

            } catch (err) {

                console.log(err);

            }
        };

    // ================= FETCH TOURS =================
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

            }
        };

    // ================= FILE =================
    const handleFile = (
        e,
        field
    ) => {

        const file =
            e.target.files[0];

        if (!file) return;

        setForm((prev) => ({
            ...prev,
            [field]: file,
        }));

        setPreview((prev) => ({
            ...prev,
            [field]:
                URL.createObjectURL(
                    file
                ),
        }));
    };

    // ================= MULTIPLE IMAGES =================
    const handleMultipleImages = (
        files
    ) => {

        const arr =
            Array.from(files);

        setForm((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                ...arr,
            ],
        }));

        setPreview((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                ...arr.map((file) =>
                    URL.createObjectURL(
                        file
                    )
                ),
            ],
        }));
    };

    // ================= RELAUNCH =================
    const handleRelaunch = (
        tour
    ) => {

        setSelectedTour(tour);

        setShowForm(true);

        setSelectedPlaces(
            tour.places?.map(
                (p) => p._id
            ) || []
        );

        setForm({
            title: tour.title,
            description:
                tour.description,

            single:
                tour.packages
                    ?.single || "",

            couple:
                tour.packages
                    ?.couple || "",

            family:
                tour.packages
                    ?.family || "",

            maxPeople:
                tour.maxPeople,

            startDate: "",
            endDate: "",

            thumbnailCard: null,
            thumbnailDetails: null,

            images: [],
        });

        setPreview({
            thumbnailCard:
                `http://localhost:3000/${tour.thumbnailCard}`,

            thumbnailDetails:
                `http://localhost:3000/${tour.thumbnailDetails}`,

            images:
                tour.images?.map(
                    (img) =>
                        `http://localhost:3000/${img}`
                ) || [],
        });
    };

    // ================= RESET =================
    const resetForm = () => {

        setSelectedTour(null);

        setSelectedPlaces([]);

        setPreview({
            thumbnailCard: "",
            thumbnailDetails: "",
            images: [],
        });

        setForm({
            title: "",
            description: "",

            single: "",
            couple: "",
            family: "",

            maxPeople: "",

            startDate: "",
            endDate: "",

            thumbnailCard: null,
            thumbnailDetails: null,

            images: [],
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        if (!form.title) {
            return showToast(
                "Title required",
                "error"
            );
        }

        if (!form.startDate) {
            return showToast(
                "Start date required",
                "error"
            );
        }

        if (!form.endDate) {
            return showToast(
                "End date required",
                "error"
            );
        }

        if (
            selectedPlaces.length === 0
        ) {
            return showToast(
                "Select at least one place",
                "error"
            );
        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem(
                    "token"
                );

            const fd =
                new FormData();

            fd.append(
                "title",
                form.title
            );

            fd.append(
                "description",
                form.description
            );

            fd.append(
                "single",
                form.single
            );

            fd.append(
                "couple",
                form.couple
            );

            fd.append(
                "family",
                form.family
            );

            fd.append(
                "maxPeople",
                form.maxPeople
            );

            fd.append(
                "startDate",
                form.startDate
            );

            fd.append(
                "endDate",
                form.endDate
            );

            fd.append(
                "places",
                JSON.stringify(
                    selectedPlaces
                )
            );

            if (
                form.thumbnailCard
            ) {

                fd.append(
                    "thumbnailCard",
                    form.thumbnailCard
                );
            }

            if (
                form.thumbnailDetails
            ) {

                fd.append(
                    "thumbnailDetails",
                    form.thumbnailDetails
                );
            }

            form.images.forEach(
                (img) => {

                    fd.append(
                        "images",
                        img
                    );

                }
            );

            const url =
                selectedTour
                    ? `${API}/tours/relaunch/${selectedTour._id}`
                    : `${API}/tours/create`;

            const method = "POST";

            const res =
                await fetch(url, {
                    method,

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: fd,
                });

            const data =
                await res.json();

            if (!data.success) {

                return showToast(
                    data.message,
                    "error"
                );
            }

            showToast(
                selectedTour
                    ? "Tour relaunched successfully"
                    : "Tour launched successfully"
            );

            fetchTours();

            resetForm();

            setShowForm(false);

        } catch (err) {

            console.log(err);

            showToast(
                "Something went wrong",
                "error"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">

            {/* TOAST */}
            {toast.show && (
                <div
                    className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white shadow-xl
                    ${toast.type === "success"
                            ? "bg-[#32AEBB]"
                            : "bg-red-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">

                <div>

                    <h2 className="text-4xl font-bold">
                        Our Tours
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Launch and relaunch travel packages
                    </p>

                </div>

                <button
                    onClick={() => {

                        resetForm();

                        setShowForm(
                            !showForm
                        );
                    }}

                    className="bg-[#32AEBB] hover:bg-[#2897a4] text-white px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-lg transition"
                >

                    <FaPlus />

                    Add New Tour

                </button>

            </div>

            {/* TOURS */}
            {!showForm && (

                <div className="grid grid-cols-3 gap-8">

                    {tours.map((tour) => (

                        <div
                            key={tour._id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300"
                        >

                            <div className="relative overflow-hidden">

                                <img
                                    src={`http://localhost:3000/${tour.thumbnailCard}`}
                                    className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 text-white">

                                    <h3 className="text-2xl font-bold">
                                        {tour.title}
                                    </h3>

                                </div>

                            </div>

                            <div className="p-5">

                                <div className="flex items-center justify-between mb-3 text-gray-500 text-sm">

                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt />
                                        {
                                            new Date(
                                                tour.startDate
                                            ).toLocaleDateString()
                                        }
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FaUsers />
                                        {
                                            tour.maxPeople
                                        }
                                    </div>

                                </div>
                                <div className="mb-5">

                                    <p className="text-gray-600 text-sm leading-7 line-clamp-3">

                                        {
                                            tour.description?.length > 120
                                                ? tour.description.slice(
                                                    0,
                                                    120
                                                ) + "..."
                                                : tour.description
                                        }

                                    </p>

                                </div>

                                <div className="flex items-center gap-2 text-[#32AEBB] font-semibold mb-5">

                                    <FaMoneyBillWave />

                                    ৳{
                                        tour.packages?.single
                                    }-
                                    ৳{
                                        tour.packages?.family
                                    }

                                </div>

                                <button
                                    onClick={() =>
                                        handleRelaunch(
                                            tour
                                        )
                                    }
                                    className="w-full bg-[#32AEBB] hover:bg-[#2897a4] text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                                >

                                    <FaEdit />

                                    Relaunch Tour

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* FORM */}
            {showForm && (

                <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">

                    <h2 className="text-3xl font-bold mb-2">

                        {selectedTour
                            ? "Relaunch Tour"
                            : "Launch New Tour"}

                    </h2>

                    <p className="text-gray-500 mb-8">

                        {selectedTour
                            ? "Update previous package with new pricing, images or dates."
                            : "Create a brand new tour package."}

                    </p>

                    {/* TITLE */}
                    <div className="mb-5">

                        <label className="font-semibold">
                            Tour Title
                        </label>

                        <input
                            type="text"
                            placeholder="Tour title"
                            value={form.title}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    title:
                                        e.target.value,
                                })
                            }
                            className="w-full mt-2 border rounded-xl px-4 py-3"
                        />

                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-5">

                        <label className="font-semibold">
                            Description
                        </label>

                        <textarea
                            rows={5}
                            placeholder="Tour description"
                            value={
                                form.description
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value,
                                })
                            }
                            className="w-full mt-2 border rounded-xl px-4 py-3"
                        />

                    </div>

                    {/* PACKAGES */}
                    <div className="grid grid-cols-3 gap-5 mb-5">

                        <input
                            type="number"
                            placeholder="Single Package"
                            value={form.single}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    single:
                                        e.target.value,
                                })
                            }
                            className="border rounded-xl px-4 py-3"
                        />

                        <input
                            type="number"
                            placeholder="Couple Package"
                            value={form.couple}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    couple:
                                        e.target.value,
                                })
                            }
                            className="border rounded-xl px-4 py-3"
                        />

                        <input
                            type="number"
                            placeholder="Family Package"
                            value={form.family}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    family:
                                        e.target.value,
                                })
                            }
                            className="border rounded-xl px-4 py-3"
                        />

                    </div>

                    {/* MAX PEOPLE */}
                    <div className="mb-5">

                        <label className="font-semibold">
                            Max People
                        </label>

                        <input
                            type="number"
                            placeholder="Max people"
                            value={form.maxPeople}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    maxPeople:
                                        e.target.value,
                                })
                            }
                            className="w-full mt-2 border rounded-xl px-4 py-3"
                        />

                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-5 mb-6">

                        <div>

                            <label className="font-semibold">
                                Start Date
                            </label>

                            <input
                                type="date"

                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }

                                value={
                                    form.startDate
                                }

                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        startDate:
                                            e.target.value,
                                    })
                                }

                                className="w-full mt-2 border rounded-xl px-4 py-3"
                            />

                        </div>

                        <div>

                            <label className="font-semibold">
                                End Date
                            </label>

                            <input
                                type="date"

                                min={
                                    form.startDate ||
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }

                                value={
                                    form.endDate
                                }

                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        endDate:
                                            e.target.value,
                                    })
                                }

                                className="w-full mt-2 border rounded-xl px-4 py-3"
                            />

                        </div>

                    </div>

                    {/* ACTIVE PLACES */}
                    <div className="mb-8 relative">

                        <label className="font-semibold block mb-3">
                            Select Active Places
                        </label>

                        <div
                            onClick={() =>
                                setOpenDropdown(
                                    !openDropdown
                                )
                            }
                            className="w-full border border-gray-200 rounded-2xl px-4 py-4 flex justify-between items-center cursor-pointer bg-white"
                        >

                            <span className="text-gray-700">

                                {selectedPlaces.length > 0
                                    ? `${selectedPlaces.length} place selected`
                                    : "Choose places"}

                            </span>

                            <FaChevronDown />

                        </div>

                        {openDropdown && (

                            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto">

                                {places.map(
                                    (place) => {

                                        const selected =
                                            selectedPlaces.includes(
                                                place._id
                                            );

                                        return (

                                            <div
                                                key={
                                                    place._id
                                                }

                                                onClick={() => {

                                                    if (
                                                        selected
                                                    ) {

                                                        setSelectedPlaces(
                                                            selectedPlaces.filter(
                                                                (
                                                                    id
                                                                ) =>
                                                                    id !==
                                                                    place._id
                                                            )
                                                        );

                                                    } else {

                                                        setSelectedPlaces(
                                                            [
                                                                ...selectedPlaces,
                                                                place._id,
                                                            ]
                                                        );

                                                    }
                                                }}

                                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition
                                                ${selected
                                                        ? "bg-[#32AEBB]/10"
                                                        : ""
                                                    }`}
                                            >

                                                <img
                                                    src={`http://localhost:3000/${place.thumbnailCard}`}
                                                    className="w-14 h-14 rounded-xl object-cover"
                                                />

                                                <div>

                                                    <h4 className="font-medium">
                                                        {place.title}
                                                    </h4>

                                                    <p className="text-sm text-gray-500">
                                                        {place.location},{" "}
                                                        {place.country}
                                                    </p>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>

                    {/* CARD THUMBNAIL */}
                    <div className="mb-6">

                        <label className="font-semibold block mb-3">
                            Card Thumbnail
                        </label>

                        <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#32AEBB] transition">

                            {preview.thumbnailCard ? (

                                <img
                                    src={
                                        preview.thumbnailCard
                                    }
                                    className="h-44 w-full object-cover rounded-2xl"
                                />

                            ) : (

                                <>
                                    <FaUpload className="text-4xl text-gray-400 mb-3" />

                                    <p className="text-gray-500">
                                        Upload card thumbnail
                                    </p>
                                </>

                            )}

                            <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                    handleFile(
                                        e,
                                        "thumbnailCard"
                                    )
                                }
                            />

                        </label>

                    </div>

                    {/* DETAILS THUMBNAIL */}
                    <div className="mb-6">

                        <label className="font-semibold block mb-3">
                            Details Thumbnail
                        </label>

                        <label className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#32AEBB] transition">

                            {preview.thumbnailDetails ? (

                                <img
                                    src={
                                        preview.thumbnailDetails
                                    }
                                    className="h-52 w-full object-cover rounded-2xl"
                                />

                            ) : (

                                <>
                                    <FaUpload className="text-4xl text-gray-400 mb-3" />

                                    <p className="text-gray-500">
                                        Upload details thumbnail
                                    </p>
                                </>

                            )}

                            <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                    handleFile(
                                        e,
                                        "thumbnailDetails"
                                    )
                                }
                            />

                        </label>

                    </div>

                    {/* GALLERY */}
                    <div className="mb-8">

                        <label className="font-semibold block mb-3">
                            Tour Gallery
                        </label>

                        <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#32AEBB] transition">

                            <FaUpload className="text-4xl text-gray-400 mb-3" />

                            <p className="text-gray-500">
                                Upload gallery images
                            </p>

                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) =>
                                    handleMultipleImages(
                                        e.target
                                            .files
                                    )
                                }
                            />

                        </label>

                        {preview.images
                            .length > 0 && (

                                <div className="grid grid-cols-4 gap-4 mt-5">

                                    {preview.images.map(
                                        (
                                            img,
                                            index
                                        ) => (

                                            <img
                                                key={
                                                    index
                                                }
                                                src={
                                                    img
                                                }
                                                className="h-28 w-full object-cover rounded-2xl"
                                            />

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={
                            handleSubmit
                        }
                        disabled={loading}
                        className="w-full bg-[#32AEBB] hover:bg-[#2897a4] text-white py-4 rounded-2xl font-semibold transition"
                    >

                        {loading
                            ? "Processing..."
                            : selectedTour
                                ? "Relaunch Tour"
                                : "Launch Tour"}

                    </button>

                </div>

            )}

        </div>
    );
};

export default LaunchTour;