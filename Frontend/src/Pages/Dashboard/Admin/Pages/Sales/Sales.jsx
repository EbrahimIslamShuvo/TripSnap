import React, {
  useEffect,
  useState,
} from "react";

import {
  FaMoneyBillWave,
  FaUsers,
  FaCrown,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";

const API =
  "http://localhost:3000/api/payment";

const Sales = () => {

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================
  useEffect(() => {

    const fetchSales =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await fetch(
              `${API}/all`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const data =
            await res.json();

          if (data.success) {

            // 🔥 ONLY SUCCESS
            const successPayments =
              (
                data.data || []
              ).filter(
                (p) =>
                  p.status ===
                  "success"
              );

            setPayments(
              successPayments
            );
          }

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);

        }
      };

    fetchSales();

  }, []);

  // ================= DATE =================
  const now =
    new Date();

  const last7Days =
    payments.filter(
      (p) => {

        const paymentDate =
          new Date(
            p.createdAt
          );

        const diff =
          (now -
            paymentDate) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 7;
      }
    );

  const last30Days =
    payments.filter(
      (p) => {

        const paymentDate =
          new Date(
            p.createdAt
          );

        const diff =
          (now -
            paymentDate) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 30;
      }
    );

  // ================= TOTAL =================
  const totalSell =
    payments.reduce(
      (
        total,
        item
      ) =>
        total +
        item.amount,
      0
    );

  const sell7Days =
    last7Days.reduce(
      (
        total,
        item
      ) =>
        total +
        item.amount,
      0
    );

  const sell30Days =
    last30Days.reduce(
      (
        total,
        item
      ) =>
        total +
        item.amount,
      0
    );

  // ================= UI =================
  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Subscription Sales 💰
        </h1>

        <p className="text-gray-500 mt-2">
          Track all subscription purchases and earnings
        </p>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="flex justify-center py-20">

          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : (

        <>
          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">

            {/* TOTAL */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Sell
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">
                    ৳{totalSell}
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-3xl">

                  <FaMoneyBillWave />

                </div>

              </div>

            </div>

            {/* 7 DAYS */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Last 7 Days
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">
                    ৳{sell7Days}
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">

                  <FaCalendarWeek />

                </div>

              </div>

            </div>

            {/* 30 DAYS */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Last 30 Days
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">
                    ৳{sell30Days}
                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl">

                  <FaCalendarAlt />

                </div>

              </div>

            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            <div className="p-6 border-b border-gray-100">

              <h2 className="text-2xl font-bold text-gray-800">
                Subscription Buyers
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4 font-semibold text-gray-700">
                      User
                    </th>

                    <th className="text-left p-4 font-semibold text-gray-700">
                      Plan
                    </th>

                    <th className="text-left p-4 font-semibold text-gray-700">
                      Amount
                    </th>

                    <th className="text-left p-4 font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="text-left p-4 font-semibold text-gray-700">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {payments.map(
                    (payment) => (

                      <tr
                        key={
                          payment._id
                        }
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >

                        {/* USER */}
                        <td className="p-4">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-full bg-[#32AEBB]/10 text-[#32AEBB] flex items-center justify-center">

                              <FaUsers />

                            </div>

                            <div>

                              <h3 className="font-semibold text-gray-800">
                                {
                                  payment
                                    ?.user
                                    ?.name
                                }
                              </h3>

                              <p className="text-xs text-gray-500">
                                {
                                  payment
                                    ?.user
                                    ?.email
                                }
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* PLAN */}
                        <td className="p-4">

                          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">

                            <FaCrown />

                            {
                              payment.plan
                            }

                          </div>

                        </td>

                        {/* AMOUNT */}
                        <td className="p-4 font-bold text-green-600">

                          ৳
                          {
                            payment.amount
                          }

                        </td>

                        {/* DATE */}
                        <td className="p-4 text-gray-600">

                          {new Date(
                            payment.createdAt
                          ).toLocaleDateString()}

                        </td>

                        {/* STATUS */}
                        <td className="p-4">

                          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">

                            Success

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Sales;