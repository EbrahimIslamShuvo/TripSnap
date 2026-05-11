import { Outlet } from "react-router-dom";
import Navbar from "../../Component/NavBar/Navbar";
import Footer from "../../Component/Footer/Footer";
import Sidebar from "../../Component/SideBar/Sidebar";
import { jwtDecode } from "jwt-decode";

import {
    FaUser,
    FaMapMarkedAlt,
    FaBlog,
    FaCrown,
    FaStar,
    FaPlus,
    FaUsers,
    FaShoppingCart,
    FaChartLine,
    FaEnvelope,
    FaUserTie,
    FaClipboardList,
    FaUserPlus
} from "react-icons/fa";

const DashboardLayout = () => {

    const token = localStorage.getItem("token");

    let role = "user";

    try {

        if (token) {
            const decoded = jwtDecode(token);

            role = decoded.role;
        }

    } catch (err) {
        console.log(err);
    }

    // ================= USER =================
    const userMenu = [
        {
            name: "Profile",
            path: "/dashboard/user",
            icon: <FaUser />,
        },

        {
            name: "Saved Places",
            path: "/dashboard/user/savedplace",
            icon: <FaMapMarkedAlt />,
        },

        {
            name: "Saved Blogs",
            path: "/dashboard/user/savedblog",
            icon: <FaBlog />,
        },
        {
            name: "My Tour",
            path: "/dashboard/user/my-tour",
            icon: <FaClipboardList />,
        },

        {
            name: "Subscription",
            path: "/dashboard/user/subscription",
            icon: <FaCrown />,
        },

        {
            name: "My Reviews",
            path: "/dashboard/user/myreview",
            icon: <FaStar />,
        },
    ];

    // ================= TRAVELER =================
    const travelerMenu = [
        {
            name: "Profile",
            path: "/dashboard/traveler",
            icon: <FaUser />,
        },

        {
            name: "Add Blogs",
            path: "/dashboard/traveler/addblog",
            icon: <FaPlus />,
        },

        {
            name: "My Blogs",
            path: "/dashboard/traveler/myblogs",
            icon: <FaBlog />,
        },

        {
            name: "Add Places",
            path: "/dashboard/traveler/addplace",
            icon: <FaMapMarkedAlt />,
        },
    ];

    // ================= AGENT =================
    const agentMenu = [
        {
            name: "Profile",
            path: "/dashboard/agent",
            icon: <FaUserTie />,
        },

        {
            name: "Launch Tour",
            path: "/dashboard/agent/add-tour",
            icon: <FaPlus />,
        },

        {
            name: "Our Tours",
            path: "/dashboard/agent/our-tours",
            icon: <FaMapMarkedAlt />,
        },

        {
            name: "Bookings",
            path: "/dashboard/agent/bookings",
            icon: <FaShoppingCart />,
        },

        {
            name: "Send Updates",
            path: "/dashboard/agent/send-update",
            icon: <FaEnvelope />,
        },
    ];

    // ================= ADMIN =================
    const adminMenu = [
        {
            name: "Profile",
            path: "/dashboard/admin",
            icon: <FaUser />,
        },

        {
            name: "Blogs",
            path: "/dashboard/admin/blog",
            icon: <FaBlog />,
        },

        {
            name: "Places",
            path: "/dashboard/admin/place",
            icon: <FaMapMarkedAlt />,
        },

        {
            name: "Users",
            path: "/dashboard/admin/user",
            icon: <FaUsers />,
        },

        // 🔥 NEW
        {
            name: "Team Management",
            path: "/dashboard/admin/team-management",
            icon: <FaUserPlus />,
        },

        {
            name: "Sales",
            path: "/dashboard/admin/sales",
            icon: <FaShoppingCart />,
        },

        {
            name: "Creator Activities",
            path: "/dashboard/admin/cratorActivities",
            icon: <FaChartLine />,
        },

        {
            name: "Messages",
            path: "/dashboard/admin/message",
            icon: <FaEnvelope />,
        },


    ];

    // ================= ROLE BASED =================
    let menu = userMenu;

    if (role === "admin") {
        menu = adminMenu;
    }

    else if (role === "traveler") {
        menu = travelerMenu;
    }

    else if (role === "agent") {
        menu = agentMenu;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">

            {/* NAVBAR */}
            <Navbar />

            {/* MAIN */}
            <div className="flex flex-1 mt-20">

                {/* SIDEBAR */}
                <div className="w-64 fixed top-20 left-0 h-[calc(100vh-80px)] bg-white border-r border-gray-200 z-40">

                    <Sidebar menu={menu} />

                </div>

                {/* CONTENT */}
                <div className="ml-64 flex-1 p-6">

                    <Outlet />

                </div>

            </div>

            {/* FOOTER */}
            <Footer />

        </div>
    );
};

export default DashboardLayout;