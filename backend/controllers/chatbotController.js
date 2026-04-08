import Doctor from "../models/doctor.js";

const detectDepartment = (msg) => {
  msg = msg.toLowerCase();

  if (msg.includes("chest") || msg.includes("heart")) {
    return "Cardiologist";
  }

  if (msg.includes("fever") || msg.includes("cough")) {
    return "General Physician";
  }

   if (msg.includes("brain") || msg.includes("headache")) {
    return "Neurologist";
  }

   if (msg.includes("rashes") || msg.includes("skin")) {
    return "Dermatologist";
  }

  return "General Physician";
};

export const chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;

    const department = detectDepartment(message);

    const today = new Date().toISOString().split("T")[0];

    const doctors = await Doctor.find({
      specialization: department,
      availability: "Available",
    }).lean();

    const availableDoctors = doctors
      .map((doc) => {
        const slots =
          doc.schedule?.[today] || doc.schedule?.get?.(today) || [];

        return {
          _id: doc._id,
          name: doc.name,
          specialization: doc.specialization,
          fee: doc.fee,
          availableSlots: slots,
        };
      })
      .filter((doc) => doc.availableSlots.length > 0);

    
    if (availableDoctors.length > 0) {
      return res.json({
        type: "available",
        reply: `Available ${department}s found`,
        doctors: availableDoctors,
      });
    }

    
    return res.json({
      type: "no-slots",
      reply: `No slots available for ${department}. Showing doctors for later booking`,
      doctors: doctors,
    });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};