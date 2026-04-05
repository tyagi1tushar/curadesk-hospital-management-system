import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const MessageBubble = ({ msg }) => {
  const { user } = useUser();

  const bookAppointment = async (doc, slot) => {
    try {
      const token = await user.getToken();

      await axios.post(
        "/api/appointments",
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
      alert("Booking failed ❌");
    }
  };

  return (
    <div className="mb-2">
      <div className="bg-gray-200 p-2 rounded">{msg.text}</div>

      {msg.doctors?.map((doc) => (
        <div key={doc._id} className="border p-2 mt-2 rounded">
          <p className="font-semibold">{doc.name}</p>

          {msg.type === "available" && (
            <div className="flex flex-wrap gap-2 mt-1">
              {doc.availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => bookAppointment(doc, slot)}
                  className="bg-blue-100 px-2 py-1 text-xs rounded"
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          {msg.type === "fallback" && (
            <p className="text-xs text-gray-500">
              No slots today — book later
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageBubble;