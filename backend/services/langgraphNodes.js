import { summarizeMedicalReport } from "./reportAIService.js";
import Doctor from "../models/doctor.js";
import { analyzeSymptoms } from "./aiService.js";

import { askReportWithLangChain } from "./langchainReportService.js";

export const ragNode =
    async (state) => {

        console.log(
            "RAG NODE"
        );

        const answer =
            await askReportWithLangChain(
                state.history,
                state.relevantChunks,
                state.question,
                state.userId
            );

        return {

            ...state,

            node:
                "rag",

            answer,
        };
    };

const symptomMap = {
    headache: {
        department: "General Physician",
        severity: "low",
        advice: "Rest, hydrate, and consult a doctor if persistent."
    },
    chest: {
        department: "Cardiologist",
        severity: "high",
        advice: "Seek medical attention."
    },
    fever: {
        department: "General Physician",
        severity: "medium",
        advice: "Monitor temperature and hydrate."
    }
};

export const summaryNode =
    async (state) => {

        console.log(
            "SUMMARY NODE"
        );

        const answer =
            await summarizeMedicalReport(

                state.relevantChunks,
                state.userId
            );

        const formattedSummary = `

🩺 Short Summary:
${answer.short_summary}

📌 Important Findings:
${answer.important_findings}

⚠ Possible Abnormalities:
${answer.possible_abnormalities}

💡 Patient Explanation:
${answer.patient_explanation}
`;

        return {

            ...state,

            answer:
                formattedSummary,

            node:
                "summary",
        };
    };

export const symptomNode =
    async (state) => {

        console.log(
            "SYMPTOM NODE"
        );

        const q =
            state.question
                ?.toLowerCase() || "";

        // =====================
        // RULE-BASED FAST PATH
        // =====================

        let aiResponse =
            null;

        for (
            const key
            in symptomMap
        ) {

            if (
                q.includes(key)
            ) {

                console.log(
                    "LOCAL SYMPTOM MATCH:",
                    key
                );

                aiResponse =
                    symptomMap[
                    key
                    ];

                break;
            }
        }

        // =====================
        // GEMINI FALLBACK
        // =====================

        if (
            !aiResponse
        ) {

            console.log(
                "GEMINI SYMPTOM FALLBACK"
            );

            aiResponse =
                await analyzeSymptoms(
                    state.question
                );
        }

        const department =
            aiResponse.department;

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        const doctors =
            await Doctor.find({

                specialization:
                    department,

                availability:
                    "Available",

            }).lean();

        const availableDoctors =
            doctors

                .map((doc) => {

                    const slots =
                        doc.schedule?.[
                        today
                        ] ||

                        doc.schedule?.get?.(
                            today
                        ) ||

                        [];

                    return {

                        _id:
                            doc._id,

                        name:
                            doc.name,

                        specialization:
                            doc.specialization,

                        fee:
                            doc.fee,

                        imageUrl:
                            doc.imageUrl,

                        rating:
                            doc.rating,

                        availableSlots:
                            slots,
                    };
                })

                .filter(

                    (doc) =>
                        doc
                            .availableSlots
                            .length > 0
                );

        return {

            ...state,

            node:
                "symptom",

            aiResponse,

            doctors:

                availableDoctors
                    .length > 0

                    ? availableDoctors

                    : doctors,
        };
    };