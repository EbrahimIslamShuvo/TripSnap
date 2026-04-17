import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ menu }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="sticky top-20 h-screen w-64 bg-[#32AEBB] text-white p-4">
      {menu.map((item, index) => {
        const isActive = location.pathname === item.path;

        return (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-md mb-3 transition-all duration-300
              ${
                isActive
                  ? "bg-[#F48C3C]"
                  : "hover:bg-[#F48C3C]/70"
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-base">{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;