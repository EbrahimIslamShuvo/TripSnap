import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

const CreatorActivites = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // 🔥 FETCH ACTIVITIES
    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`${API}/activities`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (data.success) {
                setActivities(data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // 🔥 HANDLE CLICK
    const handleClick = (act) => {
        if (act.type === "BLOG" && act.blog?._id) {
            navigate(`/tripsnap/blog/${act.blog._id}`);
        }

        if (act.type === "PLACE" && act.place?._id) {
            navigate(`/tripsnap/place/${act.place._id}`);
        }
    };

    // 🔥 LOADING
    if (loading) {
        return (
            <div className="p-6 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">

            <h2 className="text-2xl font-semibold mb-6">
                Creator Activities
            </h2>

            {/* EMPTY */}
            {activities.length === 0 ? (
                <div className="text-gray-500 text-center">
                    No activities yet 😢
                </div>
            ) : (

                <div className="space-y-4">

                    {activities.map((act) => (
                        <div
                            key={act._id}
                            onClick={() => {
                                console.log("CLICKED", act);
                                handleClick(act);
                            }}
                            className="bg-white shadow rounded-lg p-4 flex items-center gap-4 hover:shadow-md hover:bg-gray-50 transition cursor-pointer"
                        >

                            {/* ICON */}
                            <div className="text-2xl">
                                {act.type === "BLOG" ? "📝" : "📍"}
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1">

                                <p className="font-medium text-gray-800">
                                    {act.message}
                                </p>

                                <p className="text-sm text-gray-400">
                                    {new Date(act.createdAt).toLocaleString()}
                                </p>

                            </div>

                            {/* ARROW */}
                            <div className="text-gray-400 text-lg">
                                →
                            </div>

                        </div>
                    ))}

                </div>

            )}

        </div>
    );
};

export default CreatorActivites;