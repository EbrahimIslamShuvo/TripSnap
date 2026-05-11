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
  FaSuitcaseRolling,
  FaPlaneDeparture,
} from "react-icons/fa";

const PAYMENT_API =
  "http://localhost:3000/api/payment";

const BOOKING_API =
  "http://localhost:3000/api/bookings";

const Sales = () => {

  // =====================================
  // STATE
  // =====================================

  const [payments, setPayments] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // FETCH
  // =====================================

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        // ================= PAYMENT
        const paymentRes =
          await fetch(
            `${PAYMENT_API}/all`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const paymentData =
          await paymentRes.json();

        // ================= BOOKING
        const bookingRes =
          await fetch(
            `${BOOKING_API}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const bookingData =
          await bookingRes.json();

        // ================= FILTER

        const successPayments =
          (
            paymentData.data || []
          ).filter(
            (p) =>
              p.status ===
              "success"
          );

        const paidBookings =
          (
            bookingData.data || []
          ).filter(
            (b) =>
              b.paymentStatus ===
              "paid"
          );

        setPayments(
          successPayments
        );

        setBookings(
          paidBookings
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

  // =====================================
  // DATE
  // =====================================

  const now =
    new Date();

  // =====================================
  // SUBSCRIPTION SELL
  // =====================================

  const subscriptionSell =
    payments.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.amount || 0
        ),
      0
    );

  // =====================================
  // TOUR SELL
  // =====================================

  const tourSell =
    bookings.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.amount || 0
        ),
      0
    );

  // =====================================
  // TOTAL
  // =====================================

  const totalRevenue =
    subscriptionSell +
    tourSell;

  // =====================================
  // LAST 7 DAYS
  // =====================================

  const last7Sub =
    payments
      .filter((p) => {

        const diff =
          (now -
            new Date(
              p.createdAt
            )) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 7;
      })
      .reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );

  const last7Tour =
    bookings
      .filter((b) => {

        const diff =
          (now -
            new Date(
              b.createdAt
            )) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 7;
      })
      .reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );

  // =====================================
  // LAST 30 DAYS
  // =====================================

  const last30Sub =
    payments
      .filter((p) => {

        const diff =
          (now -
            new Date(
              p.createdAt
            )) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 30;
      })
      .reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );

  const last30Tour =
    bookings
      .filter((b) => {

        const diff =
          (now -
            new Date(
              b.createdAt
            )) /
          (1000 *
            60 *
            60 *
            24);

        return diff <= 30;
      })
      .reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.amount || 0
          ),
        0
      );

  // =====================================
  // UI
  // =====================================

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-4xl font-black text-gray-800 mb-3">

          Revenue Analytics 💰

        </h1>

        <p className="text-gray-500 text-lg">

          Subscription + Tour booking earnings overview

        </p>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="flex justify-center py-24">

          <div className="w-12 h-12 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : (

        <>
          {/* STATS */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            {/* TOTAL */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Revenue
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">

                    ৳{totalRevenue}

                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-3xl">

                  <FaMoneyBillWave />

                </div>

              </div>

            </div>

            {/* SUB */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Subscription Sell
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">

                    ৳{subscriptionSell}

                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center text-3xl">

                  <FaCrown />

                </div>

              </div>

            </div>

            {/* TOUR */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Tour Sell
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">

                    ৳{tourSell}

                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">

                  <FaSuitcaseRolling />

                </div>

              </div>

            </div>

            {/* TOTAL BOOKINGS */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Tour Bookings
                  </p>

                  <h2 className="text-4xl font-black mt-2 text-gray-800">

                    {bookings.length}

                  </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl">

                  <FaPlaneDeparture />

                </div>

              </div>

            </div>

          </div>

          {/* LAST SALES */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            {/* 7 DAYS */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">

                  Last 7 Days

                </h2>

                <FaCalendarWeek className="text-3xl text-[#32AEBB]" />

              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <span>
                    Subscription
                  </span>

                  <span className="font-bold text-green-600">

                    ৳{last7Sub}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span>
                    Tour Booking
                  </span>

                  <span className="font-bold text-blue-600">

                    ৳{last7Tour}

                  </span>

                </div>

              </div>

            </div>

            {/* 30 DAYS */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">

                  Last 30 Days

                </h2>

                <FaCalendarAlt className="text-3xl text-[#32AEBB]" />

              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <span>
                    Subscription
                  </span>

                  <span className="font-bold text-green-600">

                    ৳{last30Sub}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span>
                    Tour Booking
                  </span>

                  <span className="font-bold text-blue-600">

                    ৳{last30Tour}

                  </span>

                </div>

              </div>

            </div>

          </div>

          {/* RECENT TOUR BOOKINGS */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

            <div className="p-6 border-b border-gray-100">

              <h2 className="text-2xl font-bold text-gray-800">

                Recent Tour Bookings

              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4">
                      User
                    </th>

                    <th className="text-left p-4">
                      Tour
                    </th>

                    <th className="text-left p-4">
                      Amount
                    </th>

                    <th className="text-left p-4">
                      Package
                    </th>

                    <th className="text-left p-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {bookings.map(
                    (booking) => (

                      <tr
                        key={
                          booking._id
                        }
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >

                        <td className="p-4">

                          {
                            booking?.user
                              ?.name
                          }

                        </td>

                        <td className="p-4">

                          {
                            booking?.tour
                              ?.title
                          }

                        </td>

                        <td className="p-4 font-bold text-green-600">

                          ৳
                          {
                            booking.amount
                          }

                        </td>

                        <td className="p-4 capitalize">

                          {
                            booking.packageType
                          }

                        </td>

                        <td className="p-4">

                          {
                            new Date(
                              booking.createdAt
                            ).toLocaleDateString()
                          }

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