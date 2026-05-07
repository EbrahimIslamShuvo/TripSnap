import React,
{
  useEffect,
  useState,
} from "react";

import {
  FaEnvelope,
  FaReply,
  FaCheckCircle,
} from "react-icons/fa";

const Message = () => {

  const [messages,
    setMessages] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [replyText,
    setReplyText] =
    useState({});

  // ================= FETCH =================
  const fetchMessages =
    async () => {

      try {

        const res =
          await fetch(
            "http://localhost:3000/api/messages/all"
          );

        const data =
          await res.json();

        if (data.success) {

          setMessages(
            data.data
          );
        }

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= REPLY =================
  const handleReply =
    async (id) => {

      try {

        const reply =
          replyText[id];

        if (!reply) {
          return alert(
            "Write a reply first"
          );
        }

        const res =
          await fetch(
            `http://localhost:3000/api/messages/reply/${id}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                reply,
              }),
            }
          );

        const data =
          await res.json();

        if (data.success) {

          alert(
            "Reply sent successfully ✅"
          );

          fetchMessages();

          setReplyText(
            (prev) => ({
              ...prev,
              [id]: "",
            })
          );
        }

      } catch (err) {

        console.log(err);

        alert(
          "Failed to send reply ❌"
        );
      }
    };

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          User Messages 📩
        </h1>

        <p className="text-gray-500 mt-2">
          Manage user messages and send replies directly from admin dashboard.
        </p>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="flex justify-center py-20">

          <div className="w-10 h-10 border-4 border-[#32AEBB] border-t-transparent rounded-full animate-spin"></div>

        </div>

      ) : messages.length === 0 ? (

        <div className="bg-white rounded-3xl p-10 text-center shadow">

          <FaEnvelope className="text-5xl mx-auto text-gray-300 mb-4" />

          <h2 className="text-2xl font-bold text-gray-700">
            No Messages Found
          </h2>

          <p className="text-gray-500 mt-2">
            Users have not sent any messages yet.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {messages.map(
            (msg) => (

              <div
                key={msg._id}
                className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
              >

                {/* TOP */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-gray-800">
                      {msg.name}
                    </h2>

                    <p className="text-[#32AEBB] text-sm mt-1">
                      {msg.email}
                    </p>

                  </div>

                  <div>

                    {msg.replied ? (

                      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">

                        <FaCheckCircle />

                        Replied

                      </div>

                    ) : (

                      <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">

                        Pending Reply

                      </div>

                    )}

                  </div>

                </div>

                {/* MESSAGE */}
                <div className="mt-6 bg-[#f7f9fc] p-5 rounded-2xl">

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {msg.message}
                  </p>

                </div>

                {/* REPLIED */}
                {msg.replied && (

                  <div className="mt-5 bg-green-50 border border-green-100 p-5 rounded-2xl">

                    <h3 className="font-semibold text-green-700 mb-2">
                      Admin Reply
                    </h3>

                    <p className="text-gray-700 whitespace-pre-line">
                      {msg.reply}
                    </p>

                  </div>

                )}

                {/* REPLY BOX */}
                {!msg.replied && (

                  <div className="mt-6">

                    <textarea
                      rows={4}
                      placeholder="Write your reply..."
                      value={
                        replyText[
                          msg._id
                        ] || ""
                      }
                      onChange={(e) =>
                        setReplyText(
                          (prev) => ({
                            ...prev,
                            [msg._id]:
                              e.target
                                .value,
                          })
                        )
                      }
                      className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#32AEBB]"
                    />

                    <button
                      onClick={() =>
                        handleReply(
                          msg._id
                        )
                      }
                      className="mt-4 flex items-center gap-2 bg-[#32AEBB] text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all"
                    >

                      <FaReply />

                      Send Reply

                    </button>

                  </div>

                )}

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
};

export default Message;