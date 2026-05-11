import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api/users";

const UsersList = () => {

  const [users, setUsers] = useState([]);

  const [tab, setTab] = useState("user");

  const [loading, setLoading] = useState(true);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API}/all`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

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

  // ================= FILTER =================
  const filteredUsers =
    users.filter(
      (u) => u.role === tab
    );

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-semibold">
            Users Management
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Manage users, travelers & agents
          </p>

        </div>

      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-6">

        {/* USER */}
        <button
          onClick={() =>
            setTab("user")
          }
          className={`px-5 py-2 rounded-xl font-medium transition
          ${
            tab === "user"
              ? "bg-[#32AEBB] text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Users
        </button>

        {/* TRAVELER */}
        <button
          onClick={() =>
            setTab("traveler")
          }
          className={`px-5 py-2 rounded-xl font-medium transition
          ${
            tab === "traveler"
              ? "bg-[#32AEBB] text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Travelers
        </button>

        {/* AGENT */}
        <button
          onClick={() =>
            setTab("agent")
          }
          className={`px-5 py-2 rounded-xl font-medium transition
          ${
            tab === "agent"
              ? "bg-[#32AEBB] text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Agents
        </button>

      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-100">

        <table className="w-full text-left">

          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-600 text-sm">

            <tr>

              <th className="p-4">
                #
              </th>

              <th className="p-4">
                Image
              </th>

              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Email
              </th>

              <th className="p-4">
                Role
              </th>

              {/* ONLY USER */}
              {tab === "user" && (
                <th className="p-4">
                  Subscription
                </th>
              )}

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {filteredUsers.map(
              (user, index) => (

                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* INDEX */}
                  <td className="p-4">
                    {index + 1}
                  </td>

                  {/* IMAGE */}
                  <td className="p-4">

                    <img
                      src={
                        user.image
                          ? user.image.includes(
                              "uploads"
                            )
                            ? `http://localhost:3000/${user.image}`
                            : `http://localhost:3000/uploads/${user.image}`
                          : "https://via.placeholder.com/40"
                      }
                      className="w-11 h-11 rounded-full object-cover border"
                    />

                  </td>

                  {/* NAME */}
                  <td className="p-4 font-medium">
                    {user.name}
                  </td>

                  {/* EMAIL */}
                  <td className="p-4 text-gray-500">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        user.role === "traveler"
                          ? "bg-purple-100 text-purple-600"

                          : user.role === "agent"
                          ? "bg-blue-100 text-blue-600"

                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  {/* USER SUBSCRIPTION */}
                  {tab === "user" && (

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
                        ${
                          user.subscription?.status ===
                          "active"
                            ? "bg-green-100 text-green-600"

                            : user.subscription?.status ===
                              "expired"
                            ? "bg-red-100 text-red-600"

                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.subscription
                          ?.status || "free"}
                      </span>

                    </td>

                  )}

                </tr>

              )
            )}

          </tbody>

        </table>

        {/* EMPTY */}
        {filteredUsers.length === 0 && (

          <div className="p-8 text-center text-gray-500">

            No {tab} found 😢

          </div>

        )}

      </div>

    </div>
  );
};

export default UsersList;