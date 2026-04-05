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
    <div className="mb-2">
      {/* MESSAGE */}
      <div className="bg-gray-200 p-2 rounded">{msg.text}</div>

      {/* DOCTORS */}
      {msg.doctors?.map((doc) => (
        <div
          key={doc._id}
          className="border p-3 mt-2 rounded-lg shadow-sm hover:shadow-md transition"
        >
          {/* 🔥 Doctor Header */}
          <div className="flex items-center gap-3">
            {/* 🧑‍⚕️ Image */}
            <img
              src={doc.imageUrl || "https://via.placeholder.com/40"}
              alt={doc.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* 📄 Info */}
            <div>
              <p className="font-semibold text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {doc.specialization}
              </p>

              {/* ⭐ Rating */}
              <div className="flex items-center text-yellow-500 text-xs">
                {"⭐".repeat(Math.round(doc.rating || 0))}
                <span className="text-gray-400 ml-1">
                  ({doc.rating || 0})
                </span>
              </div>
            </div>
          </div>

          {/* ✅ CASE 1: SLOTS AVAILABLE */}
          {msg.type === "available" && (
            <div className="flex flex-wrap gap-2 mt-2">
              {doc.availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => bookAppointment(doc, slot)}
                  className="bg-blue-100 px-2 py-1 text-xs rounded hover:bg-blue-200"
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {/* ❌ CASE 2: NO SLOTS */}
          {msg.type === "no-slots" && (
            <>
              <p className="text-xs text-gray-500 mt-2">
                No slots today — you can book for later
              </p>

              <button
                onClick={() => navigate(`/doctors/${doc._id}`)}  
                className="mt-2 text-blue-500 text-xs underline hover:text-blue-700"
              >
                Book for later
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageBubble;