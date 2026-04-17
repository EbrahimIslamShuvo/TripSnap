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
} from "react-icons/fa";

const DashboardLayout = () => {
    const token = localStorage.getItem("token");

    let role = "user";

    try {
        const decoded = jwtDecode(token);
        role = decoded.role;
    } catch {
        console.log("error");

    }

    // USER
    const userMenu = [
        { name: "Profile", path: "/dashboard/user", icon: <FaUser /> },
        { name: "Saved Places", path: "/dashboard/user/savedplace", icon: <FaMapMarkedAlt /> },
        { name: "Saved Blogs", path: "/dashboard/user/savedblog", icon: <FaBlog /> },
        { name: "Subscription", path: "/dashboard/user/subscription", icon: <FaCrown /> },
        { name: "My Reviews", path: "/dashboard/user/myreview", icon: <FaStar /> },
    ];

    // CREATOR
    const creatorMenu = [
        { name: "Profile", path: "/dashboard/creator", icon: <FaUser /> },
        { name: "Add Blogs", path: "/dashboard/creator/addblog", icon: <FaPlus /> },
        { name: "My Blogs", path: "/dashboard/creator/myblogs", icon: <FaBlog /> },
        { name: "Add Places", path: "/dashboard/creator/addplace", icon: <FaMapMarkedAlt /> },
    ];

    // ADMIN
    const adminMenu = [
        { name: "Profile", path: "/dashboard/admin", icon: <FaUser /> },
        { name: "Blogs", path: "/dashboard/admin/blog", icon: <FaBlog /> },
        { name: "Places", path: "/dashboard/admin/place", icon: <FaMapMarkedAlt /> },
        { name: "Users", path: "/dashboard/admin/user", icon: <FaUsers /> },
        { name: "Sales", path: "/dashboard/admin/sales", icon: <FaShoppingCart /> },
        { name: "Creator Activities", path: "/dashboard/admin/cratorActivities", icon: <FaChartLine /> },
        { name: "Messages", path: "/dashboard/admin/message", icon: <FaEnvelope /> },
    ];

    // 🔥 ROLE BASED SELECT
    let menu = userMenu;
    if (role === "admin") menu = adminMenu;
    else if (role === "traveler") menu = creatorMenu;

    return (
        <div className="flex flex-col min-h-screen">

            <Navbar />

            {/* 🔥 MAIN AREA */}
            <div className="flex flex-1 mt-20">

                {/* SIDEBAR */}
                <div className="w-64 fixed top-20 left-0 h-[calc(100vh-80px)]">
                    <Sidebar menu={menu} />
                </div>

                {/* CONTENT */}
                <div className="ml-64 flex-1 p-6">
                    <Outlet />
                </div>

            </div>

            <Footer />

        </div>
    );
};

export default DashboardLayout;