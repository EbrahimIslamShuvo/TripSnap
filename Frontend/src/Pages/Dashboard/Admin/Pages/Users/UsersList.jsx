import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api/users";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("user");
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH USERS
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.data || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 FILTER
  const filteredUsers = users.filter((u) => u.role === tab);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold mb-6">
        Users Management
      </h2>

      {/* 🔥 TOGGLE */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("user")}
          className={`px-4 py-2 rounded-lg ${
            tab === "user"
              ? "bg-[#32AEBB] text-white"
              : "bg-gray-200"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setTab("traveler")}
          className={`px-4 py-2 rounded-lg ${
            tab === "traveler"
              ? "bg-[#32AEBB] text-white"
              : "bg-gray-200"
          }`}
        >
          Travelers
        </button>
      </div>

      {/* 🔥 TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full text-left">

          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>

              {/* 🔥 TYPE ONLY FOR USER */}
              {tab === "user" && (
                <th className="p-3">Type</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">

                <td className="p-3">{index + 1}</td>

                {/* 🔥 IMAGE FIX */}
                <td className="p-3">
                  <img
                    src={
                      user.image
                        ? user.image.includes("uploads")
                          ? `http://localhost:3000/${user.image}`
                          : `http://localhost:3000/uploads/${user.image}`
                        : "https://via.placeholder.com/40"
                    }
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>

                <td className="p-3 font-medium">{user.name}</td>

                <td className="p-3 text-gray-500">{user.email}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "traveler"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* 🔥 TYPE COLUMN */}
                {tab === "user" && (
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium
                      ${
                        user.userType === "active"
                          ? "bg-green-100 text-green-600"
                          : user.userType === "expired"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.userType || "free"}
                    </span>
                  </td>
                )}

              </tr>
            ))}
          </tbody>

        </table>

        {/* EMPTY STATE */}
        {filteredUsers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No {tab} found 😢
          </div>
        )}

      </div>
    </div>
  );
};

export default UsersList;