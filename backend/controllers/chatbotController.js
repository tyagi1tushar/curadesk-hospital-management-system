import Doctor from "../models/doctor.js";

// 🔹 Symptom → Department Mapping
const symptomMap = {
  fever: "General Physician",
  cough: "General Physician",
  cold: "General Physician",
  headache: "Neurologist",
  chest: "Cardiologist",
  heart: "Cardiologist",
  skin: "Dermatologist",
  acne: "Dermatologist",
};

// 🔹 Detect department
const detectDepartment = (message) => {
  message = message.toLowerCase();

  for (let key in symptomMap) {
    if (message.includes(key)) {
      return symptomMap[key];
    }
  }

  return "General Physician";
};

// 🔥 MAIN FUNCTION
export const chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const department = detectDepartment(message);

    const today = new Date().toISOString().split("T")[0];

    // 🔹 Get all doctors of that specialization
    const doctors = await Doctor.find({
      specialization: department,
      availability: "Available",
    }).lean();

    // 🔥 Check today's slots
    const availableDoctors = doctors
      .map((doc) => {
        const slots =
          doc.schedule?.get?.(today) || doc.schedule?.[today] || [];

        return {
          _id: doc._id,
          name: doc.name,
          specialization: doc.specialization,
          fee: doc.fee,
          rating: doc.rating,
          availableSlots: slots,
        };
      })
      .filter((doc) => doc.availableSlots.length > 0);

    // ✅ CASE 1: Available doctors today
    if (availableDoctors.length > 0) {
      return res.json({
        success: true,
        type: "available",
        reply: `I found ${availableDoctors.length} available ${department}s today 👇`,
        doctors: availableDoctors
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3),
      });
    }

    // ❌ CASE 2: No slots → fallback
    const fallbackDoctors = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      specialization: doc.specialization,
      fee: doc.fee,
      rating: doc.rating,
      availableSlots: [],
    }));

    return res.json({
      success: true,
      type: "fallback",
      reply: `No ${department} available today. But here are doctors you can book for later 👇`,
      doctors: fallbackDoctors
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    });

  } catch (error) {
    console.error("Chatbot Error:", error);

    return res.status(500).json({
      success: false,
      message: "Chatbot server error",
    });
  }
};