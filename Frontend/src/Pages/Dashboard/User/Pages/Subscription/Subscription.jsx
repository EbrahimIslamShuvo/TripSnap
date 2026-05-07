import React, {
  useEffect,
  useState,
} from "react";

import {
  FaCheckCircle,
  FaCrown,
  FaBolt,
} from "react-icons/fa";

const Subscription = () => {

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  // 🔥 USER
  const [user, setUser] =
    useState(() => {

      return JSON.parse(
        localStorage.getItem(
          "user"
        ) || "null"
      );
    });

  // 🔥 CURRENT PLAN
  const currentPlan =
    user?.subscription?.plan ||
    "free";

  // ================= REFRESH USER =================
  const fetchUpdatedUser =
    async () => {

      try {

        setRefreshing(true);

        const oldUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "null"
          );

        if (!oldUser?._id) return;

        const res = await fetch(
          `http://localhost:3000/api/users/${oldUser._id}`
        );

        const data =
          await res.json();

        if (data.success) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.data
            )
          );

          setUser(data.data);
        }

      } catch (err) {

        console.log(err);

      } finally {

        setRefreshing(false);

      }
    };

  // ================= CHECK SUCCESS =================
  useEffect(() => {

    const success =
      new URLSearchParams(
        window.location.search
      ).get("success");

    if (success === "true") {

      fetchUpdatedUser();

      // 🔥 CLEAN URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

  }, []);

  // ================= PLANS =================
  const plans = [

    // FREE
    {
      id: "free",

      name: "Free",

      price: "৳0",

      duration: "Forever",

      color:
        "from-gray-500 to-gray-700",

      icon: <FaBolt />,

      features: [
        "Access only 3 places",
        "Access only 3 blogs",
        "No comment access",
        "Basic experience",
      ],
    },

    // DAILY
    {
      id: "daily",

      name: "Premium Daily",

      price: "৳29",

      duration: "1 Day",

      color:
        "from-cyan-500 to-blue-500",

      icon: <FaCrown />,

      features: [
        "Unlimited places",
        "Unlimited blogs",
        "Comment access",
        "Premium features",
      ],
    },

    // MONTHLY
    {
      id: "monthly",

      name: "Premium Monthly",

      price: "৳299",

      duration: "30 Days",

      color:
        "from-[#000080] via-[#0047AB] to-[#32AEBB]",

      popular: true,

      icon: <FaCrown />,

      features: [
        "Unlimited places",
        "Unlimited blogs",
        "Comment access",
        "Priority access",
        "Best for travelers",
      ],
    },

    // YEARLY
    {
      id: "yearly",

      name: "Premium Yearly",

      price: "৳2499",

      duration: "365 Days",

      color:
        "from-purple-600 to-pink-500",

      icon: <FaCrown />,

      features: [
        "Unlimited everything",
        "Comment access",
        "Priority support",
        "Best value package",
        "Full premium access",
      ],
    },
  ];

  // ================= PAYMENT =================
  const handleBuy = async (
    plan
  ) => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      const res = await fetch(
        "http://localhost:3000/api/payment/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            plan,
          }),
        }
      );

      const data =
        await res.json();

      console.log(data);

      // 🔥 SSL REDIRECT
      if (
        data?.success &&
        data?.url
      ) {

        window.location.href =
          data.url;
      }

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="text-center mb-14">

        <h1 className="text-4xl font-bold text-gray-800">
          Upgrade Your Journey ✈️
        </h1>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">

          Choose the perfect subscription plan and unlock premium travel experiences.

        </p>

        {/* CURRENT */}
        <div className="mt-6 inline-flex items-center gap-2 bg-[#32AEBB]/10 text-[#32AEBB] px-5 py-2 rounded-full font-semibold">

          Current Plan:
          {" "}
          {currentPlan.toUpperCase()}

        </div>

        {refreshing && (

          <p className="text-sm text-gray-500 mt-3">

            Updating subscription...

          </p>

        )}

      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 items-stretch">

        {plans.map((plan) => {

          const isCurrent =
            currentPlan ===
            plan.id;

          return (

            <div
              key={plan.id}
              className={`
                relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100
                hover:-translate-y-2 transition-all duration-300
                flex flex-col
                ${
                  plan.popular
                    ? "scale-[1.03] border-[#32AEBB]"
                    : ""
                }
              `}
            >

              {/* POPULAR */}
              {plan.popular && (

                <div className="absolute top-4 right-4 bg-[#32AEBB] text-white text-xs font-bold px-3 py-1 rounded-full">

                  POPULAR

                </div>

              )}

              {/* TOP */}
              <div
                className={`bg-gradient-to-r ${plan.color} p-7 text-white`}
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {plan.name}
                    </h2>

                    <p className="text-white/80 text-sm mt-1">
                      {plan.duration}
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">

                    {plan.icon}

                  </div>

                </div>

                <div className="mt-7">

                  <span className="text-4xl font-black">
                    {plan.price}
                  </span>

                </div>

              </div>

              {/* BODY */}
              <div className="p-6 flex flex-col flex-1">

                {/* FEATURES */}
                <div className="space-y-4 flex-1">

                  {plan.features.map(
                    (
                      feature,
                      index
                    ) => (

                      <div
                        key={index}
                        className="flex gap-3 items-start"
                      >

                        <FaCheckCircle className="text-[#32AEBB] mt-1 flex-shrink-0" />

                        <p className="text-gray-700 text-sm">
                          {feature}
                        </p>

                      </div>

                    )
                  )}

                </div>

                {/* BUTTON */}
                <div className="mt-8">

                  <button
                    disabled={
                      isCurrent ||
                      loading ||
                      plan.id ===
                        "free"
                    }
                    onClick={() =>
                      handleBuy(
                        plan.id
                      )
                    }
                    className={`
                      w-full py-3 rounded-2xl font-bold transition-all duration-300
                      ${
                        isCurrent
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#32AEBB] text-white hover:scale-105 hover:shadow-xl"
                      }
                    `}
                  >

                    {plan.id ===
                    "free"
                      ? "Default Plan"
                      : isCurrent
                      ? "Current Plan"
                      : loading
                      ? "Processing..."
                      : "Buy Now"}

                  </button>

                </div>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
};

export default Subscription;