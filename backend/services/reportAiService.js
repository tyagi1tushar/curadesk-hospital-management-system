import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const summarizeMedicalReport = async (
  reportText
) => {

  try {

    const prompt = `
You are an AI medical assistant.

Analyze the following medical report.

Give:
1. Short summary
2. Important findings
3. Possible abnormalities
4. Simple patient-friendly explanation

Keep response concise and clean.

Medical Report:
${reportText}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

    return response.text;

  } catch (err) {

    console.log("REPORT AI ERROR:", err);

    return "AI report analysis failed.";
  }
};