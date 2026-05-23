import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const MessageBubble = ({ msg }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const bookAppointment = async (doc, slot) => {
    try {
      if (!user) {
        alert("Please login first");
        return;
      }

      const token = await user.getToken();

      await axios.post(
        "http://localhost:4000/api/appointments",
        {
          doctorId: doc._id,
          patientName: user.fullName,
          mobile: "9999999999",
          date: new Date().toISOString().split("T")[0],
          time: slot,
          fee: doc.fee || 0,
          paymentMethod: "Cash",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment booked ✅");
    } catch (err) {
      console.error("BOOK ERROR:", err);
      alert("Booking failed ❌");
    }
  };

  return (
    <div className="flex-1 p-3 overflow-y-auto max-h-96 backdrop-blur-sm">

      {/* MESSAGE ROW */}
      <div
        className={`max-w-[95%] px-4 py-2 rounded-2xl text-sm shadow-md leading-relaxed
  ${msg.sender === "user"
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white/80 backdrop-blur-md border border-white/40 text-gray-800 rounded-bl-none"}`}
      >

        <div className="whitespace-pre-line">
          {msg.text}
        </div>

        {/* RAG RETRIEVED CONTEXT */}
        {
          msg.context && (

            <div
              className="
      mt-1
      p-2
      rounded-2xl
      bg-gradient-to-br
      from-gray-50
      to-gray-100
      border border-gray-200
      shadow-inner
      max-h-51
      overflow-y-auto"
            >

              <div className="flex items-center gap-1 mb-2">

                <div
                  className="
          w-1 h-1
          rounded-full
          bg-blue-500"
                />

                <p
                  className="
          text-xs
          font-bold
          uppercase
          tracking-wide
          text-blue-600"
                >
                  Retrieved Context
                </p>

              </div>

              <p
                className="
        text-sm
        leading-relaxed
        text-gray-700
        whitespace-pre-line"
              >
                {msg.context}
              </p>

            </div>
          )
        }

      </div>

      {/* DOCTOR CARDS (ALWAYS BELOW MESSAGE) */}
      {msg.sender === "bot" && msg.doctors?.map((doc) => (
        <div
          key={doc._id}
          className="mt-2 w-full bg-white border rounded-xl p-2 shadow-sm"
        >
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <img
              src={doc.imageUrl || "https://via.placeholder.com/40"}
              alt={doc.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">{doc.specialization}</p>

              <div className="text-yellow-500 text-xs">
                {"⭐".repeat(Math.round(doc.rating || 0))}
                <span className="text-gray-400 ml-1">
                  ({doc.rating || 0})
                </span>
              </div>
            </div>
          </div>

          {/* AVAILABLE */}
          {msg.type === "available" && (
            <div className="flex flex-wrap gap-2 mt-2">
              {doc.availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => bookAppointment(doc, slot)}
                  className="bg-blue-100 hover:bg-blue-200 text-xs px-2 py-1 rounded"
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {/* NO SLOTS */}
          {msg.type === "no-slots" && (
            <>
              <p className="text-xs text-gray-500 mt-2">
                No slots today — book for later
              </p>

              <button
                onClick={() => navigate(`/doctors/${doc._id}`)}
                className="mt-2 text-blue-600 text-xs underline"
              >
                View & Book
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageBubble;