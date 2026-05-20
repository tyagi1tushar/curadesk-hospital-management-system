import Doctor from "../models/doctor.js";
import { analyzeSymptoms } from "../services/aiService.js";
import redisClient from "../config/redis.js";


export const chatbotReply = async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = req.ip;
    const oldMessages = await redisClient.get(sessionId);

    const history = oldMessages
      ? JSON.parse(oldMessages)
      : [];

      console.log("CHAT HISTORY:", history);

    history.push({
      role: "user",
      content: message,
    });

    const aiResponse = await analyzeSymptoms(
      message,
      history
    );

    history.push({
      role: "assistant",
      content: JSON.stringify(aiResponse),
    });

    await redisClient.set(
      sessionId,
      JSON.stringify(history),
      {
        EX: 3600,
      }
    );

    const department = aiResponse.department;

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
        reply: `
🏥 Department: ${department}

⚠️ Severity: ${aiResponse.severity}

💡 Advice:
${aiResponse.advice}
`,
        doctors: availableDoctors,
      });
    }


    return res.json({
      type: "no-slots",
      reply: `
🏥 Department: ${department}

⚠️ Severity: ${aiResponse.severity}

💡 Advice:
${aiResponse.advice}

❌ No slots available today.

📅 Showing doctors for later booking.
`,
      doctors: doctors,
    });
  } catch (err) {
    res.status(500).json({ message: "error" });
  }
};