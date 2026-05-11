import React, { useState } from "react";
import {
    FaUserPlus,
    FaUpload,
} from "react-icons/fa";

const API =
    "http://localhost:3000/api/users";

const Teammanagemment = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "traveler",
    });

    const [image, setImage] =
        useState(null);

    const [preview, setPreview] =
        useState("");

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

    // ================= IMAGE =================
    const handleImage = (e) => {

        const file =
            e.target.files[0];

        if (!file) return;

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        // 🔥 VALIDATION
        if (!form.name) {
            return showToast(
                "Name is required",
                "error"
            );
        }

        if (!form.email) {
            return showToast(
                "Email is required",
                "error"
            );
        }

        if (!image) {
            return showToast(
                "Profile image required",
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
                "name",
                form.name
            );

            fd.append(
                "email",
                form.email
            );

            fd.append(
                "role",
                form.role
            );

            fd.append(
                "image",
                image
            );

            const res = await fetch(
                `${API}/create-team-member`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: fd,
                }
            );

            const data =
                await res.json();

            // 🔥 ERROR
            if (!data.success) {
                return showToast(
                    data.message,
                    "error"
                );
            }

            // 🔥 SUCCESS
            showToast(
                "Team member created successfully ✅"
            );

            // RESET
            setForm({
                name: "",
                email: "",
                role: "traveler",
            });

            setImage(null);

            setPreview("");

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
        <div className="max-w-2xl mx-auto p-6">

            {/* TOAST */}
            {toast.show && (
                <div
                    className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white shadow-lg
                    ${toast.type === "success"
                            ? "bg-[#32AEBB]"
                            : "bg-red-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* CARD */}
            <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8">

                    <div className="bg-[#32AEBB]/10 p-4 rounded-2xl text-[#32AEBB] text-2xl">

                        <FaUserPlus />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            Team Management
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Create traveler or agent account
                        </p>

                    </div>

                </div>

                {/* NAME */}
                <div className="mb-5">

                    <label className="text-sm font-medium">
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-[#32AEBB]"
                    />

                </div>

                {/* EMAIL */}
                <div className="mb-5">

                    <label className="text-sm font-medium">
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                email: e.target.value,
                            })
                        }
                        className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-[#32AEBB]"
                    />

                </div>

                {/* ROLE */}
                <div className="mb-5">

                    <label className="text-sm font-medium">
                        Select Role
                    </label>

                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                role: e.target.value,
                            })
                        }
                        className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-[#32AEBB]"
                    >

                        <option value="traveler">
                            Traveler
                        </option>

                        <option value="agent">
                            Agent
                        </option>

                    </select>

                </div>

                {/* IMAGE */}
                <div className="mb-8">

                    <label className="text-sm font-medium">
                        Profile Photo
                    </label>

                    <label className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#32AEBB] transition">

                        {preview ? (

                            <img
                                src={preview}
                                className="h-32 w-32 rounded-full object-cover"
                            />

                        ) : (

                            <>
                                <FaUpload className="text-3xl text-gray-400 mb-2" />

                                <p className="text-sm text-gray-500">
                                    Upload profile image
                                </p>
                            </>

                        )}

                        <input
                            type="file"
                            hidden
                            onChange={handleImage}
                        />

                    </label>

                </div>

                {/* BUTTON */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#32AEBB] hover:bg-[#2897a4] transition text-white py-3 rounded-2xl font-medium"
                >

                    {loading
                        ? "Creating..."
                        : "Create Team Member"}

                </button>

            </div>

        </div>
    );
};

export default Teammanagemment;