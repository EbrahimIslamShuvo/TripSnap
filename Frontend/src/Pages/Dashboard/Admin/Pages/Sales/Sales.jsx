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

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  FaFilePdf,
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

  const [selectedYear, setSelectedYear] =
    useState(
      new Date().getFullYear()
    );

  const [selectedMonth, setSelectedMonth] =
    useState(
      new Date().getMonth()
    );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  // PDF REPORT
  // =====================================

  // =====================================
  // PDF REPORT
  // =====================================

  // =====================================
  // PDF REPORT
  // =====================================

  const generateReport =
    async () => {

      const token =
        localStorage.getItem(
          "token"
        );

      // ================= TOURS
      const tourRes =
        await fetch(
          "http://localhost:3000/api/tours",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const tourData =
        await tourRes.json();

      const allTours =
        tourData.data || [];

      // ================= FILTER TOUR LAUNCH
      const launchedTours =
        allTours.filter(
          (tour) => {

            const date =
              new Date(
                tour.createdAt
              );

            return (
              date.getFullYear() ===
              Number(
                selectedYear
              ) &&
              date.getMonth() ===
              Number(
                selectedMonth
              )
            );
          }
        );

      // ================= FILTER BOOKING
      const monthBookings =
        bookings.filter(
          (booking) => {

            const date =
              new Date(
                booking.createdAt
              );

            return (
              date.getFullYear() ===
              Number(
                selectedYear
              ) &&
              date.getMonth() ===
              Number(
                selectedMonth
              )
            );
          }
        );

      // ================= FILTER PAYMENT
      const monthPayments =
        payments.filter(
          (payment) => {

            const date =
              new Date(
                payment.createdAt
              );

            return (
              date.getFullYear() ===
              Number(
                selectedYear
              ) &&
              date.getMonth() ===
              Number(
                selectedMonth
              )
            );
          }
        );

      // ================= CALCULATION

      const totalTourRevenue =
        monthBookings.reduce(
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

      const totalSubscriptionRevenue =
        monthPayments.reduce(
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
      // PDF
      // =====================================

      const doc =
        new jsPDF();

      doc.setFontSize(22);

      doc.text(
        "TripSnap Monthly Sales Report",
        14,
        20
      );

      doc.setFontSize(14);

      doc.text(
        `Month: ${months[
        selectedMonth
        ]
        } ${selectedYear}`,
        14,
        32
      );

      // ================= SUMMARY TABLE

      autoTable(doc, {
        startY: 45,

        head: [
          [
            "Report Type",
            "Count",
            "Revenue",
          ],
        ],

        body: [
          [
            "Tour Launch",
            launchedTours.length,
            "-",
          ],

          [
            "Tour Booking",
            monthBookings.length,
            `Tk ${totalTourRevenue}`,
          ],

          [
            "Subscriptions",
            monthPayments.length,
            `Tk ${totalSubscriptionRevenue}`,
          ],

          [
            "Total Revenue",
            "-",
            `Tk ${totalTourRevenue +
            totalSubscriptionRevenue
            }`,
          ],
        ],
      });

      // =====================================
      // TOUR SUMMARY
      // =====================================

      const groupedTours =
        {};

      monthBookings.forEach(
        (booking) => {

          const title =
            booking?.tour
              ?.title ||
            "Unknown";

          if (
            !groupedTours[
            title
            ]
          ) {

            groupedTours[
              title
            ] = {

              totalBooking: 0,

              totalSell: 0,
            };
          }

          groupedTours[
            title
          ].totalBooking += 1;

          groupedTours[
            title
          ].totalSell +=
            Number(
              booking.amount || 0
            );
        }
      );

      autoTable(doc, {
        startY:
          doc.lastAutoTable
            .finalY + 15,

        head: [
          [
            "Tour Name",
            "Total Booking",
            "Total Sell",
          ],
        ],

        body:
          Object.entries(
            groupedTours
          ).map(
            ([
              title,
              data,
            ]) => [

                title,

                data.totalBooking,

                `Tk ${data.totalSell}`,
              ]
          ),
      });

      // =====================================
      // SUBSCRIPTION SUMMARY
      // =====================================

      const groupedPlans =
        {};

      monthPayments.forEach(
        (payment) => {

          const plan =
            payment.plan;

          if (
            !groupedPlans[
            plan
            ]
          ) {

            groupedPlans[
              plan
            ] = {

              totalUser: 0,

              totalSell: 0,
            };
          }

          groupedPlans[
            plan
          ].totalUser += 1;

          groupedPlans[
            plan
          ].totalSell +=
            Number(
              payment.amount || 0
            );
        }
      );

      autoTable(doc, {
        startY:
          doc.lastAutoTable
            .finalY + 15,

        head: [
          [
            "Subscription Plan",
            "Total Users",
            "Total Sell",
          ],
        ],

        body:
          Object.entries(
            groupedPlans
          ).map(
            ([
              plan,
              data,
            ]) => [

                plan,

                data.totalUser,

                `Tk ${data.totalSell}`,
              ]
          ),
      });

      // =====================================
      // SAVE PDF
      // =====================================

      doc.save(
        `sales-report-${months[
        selectedMonth
        ]
        }-${selectedYear}.pdf`
      );
    };

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

          {/* ===================================== */}
          {/* MONTHLY REPORT */}
          {/* ===================================== */}

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 mb-10">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold text-gray-800">

                  Monthly Report Generator

                </h2>

                <p className="text-gray-500 mt-2">

                  Download sales report by month & year

                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl">

                <FaFilePdf />

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {/* YEAR */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Select Year

                </label>

                <select
                  value={
                    selectedYear
                  }
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#32AEBB]"
                >

                  {[2024, 2025, 2026, 2027, 2028].map(
                    (year) => (

                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* MONTH */}
              <div>

                <label className="block mb-2 font-semibold text-gray-700">

                  Select Month

                </label>

                <select
                  value={
                    selectedMonth
                  }
                  onChange={(e) =>
                    setSelectedMonth(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-[#32AEBB]"
                >

                  {months.map(
                    (
                      month,
                      index
                    ) => (

                      <option
                        key={index}
                        value={index}
                      >
                        {month}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* BUTTON */}
              <div className="flex items-end">

                <button
                  onClick={
                    generateReport
                  }
                  className="w-full bg-[#32AEBB] hover:bg-[#2897a4] text-white py-4 rounded-2xl font-bold transition flex items-center justify-center gap-3"
                >

                  <FaFilePdf />

                  Generate PDF Report

                </button>

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