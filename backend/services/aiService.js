import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeSymptoms = async (
  message,
  history = []
) => {

  try {

    // Convert history into text
    const previousConversation = history
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
You are a medical assistant.

Analyze the symptoms carefully.

Choose ONLY ONE department from:
- Cardiologist
- Neurologist
- Dermatologist
- General Physician

Keep advice short and concise in 1-2 sentences.

Conversation History:
${previousConversation}

Current Patient Message:
"${message}"

Return ONLY valid JSON.

Format:
{
  "department": "",
  "severity": "",
  "advice": ""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;

    // Remove markdown if Gemini adds it
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (err) {

    console.log("FULL AI ERROR:", err);

    return {
      department: "General Physician",
      severity: "low",
      advice: "Please consult a doctor.",
    };
  }
};