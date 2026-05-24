import { StateGraph } from "@langchain/langgraph";
import { GoogleGenAI } from "@google/genai";

import {

  ragNode,

  summaryNode,

  symptomNode

} from "./langgraphNodes.js";

const ai =
  new GoogleGenAI({

    apiKey:
      process.env.GEMINI_API_KEY,
  });

const graphState = {

  question: null,

  route: null,

  answer: null,

  relevantChunks: null,

  aiResponse: null,

  doctors: null,
};

// ======================
// HYBRID ROUTER
// ======================

const routerNode =
  async (state) => {

    const question =
      state.question
        ?.toLowerCase() || "";

    console.log(
      "LANGGRAPH ROUTER:",
      question
    );

    // =================
    // FAST KEYWORD ROUTING
    // =================

    const symptomKeywords = [

      "pain",
      "fever",
      "headache",
      "chest",
      "cough",
      "cold",
      "nausea",
      "vomit",
      "dizzy",
      "hurt",
      "ache",
      "breathing",
      "sick",
      "infection",
      "pressure",
      "migraine",
      "doctor",
      "medicine",
      "symptom",
    ];

    const summaryKeywords = [

      "summary",
      "summarize",
      "brief",
      "overview",
      "summarize pdf",
      "summarize report",
      "analyze report",
    ];

    // FAST SYMPTOM

    if (

      symptomKeywords.some(
        word =>
          question.includes(
            word
          )
      )

    ) {

      console.log(
        "FAST ROUTE: symptom"
      );

      return {

        ...state,

        route:
          "symptom",
      };
    }

    // FAST SUMMARY

    if (

      summaryKeywords.some(
        word =>
          question.includes(
            word
          )
      )

    ) {

      console.log(
        "FAST ROUTE: summary"
      );

      return {

        ...state,

        route:
          "summary",
      };
    }

    // =================
    // GEMINI FALLBACK
    // =================

    console.log(
      "LLM ROUTER FALLBACK"
    );

    const prompt = `

You are an AI intent router.

Classify the query into ONLY ONE:

symptom
summary
rag

Rules:

symptom:
- illness
- symptoms
- health complaints
- pain
- doctor recommendation
- medical advice

summary:
- summarize report
- summarize pdf
- report overview
- short analysis

rag:
- factual questions
- uploaded file questions
- information retrieval
- everything else

Return ONLY:

symptom
OR
summary
OR
rag

Question:
${question}

`;

    const response =
      await ai.models.generateContent({

        model:
          "gemini-3-flash-preview",

        contents:
          prompt,
      });

    const route =
      response.text
        .trim()
        .toLowerCase();

    console.log(
      "LLM ROUTE:",
      route
    );

    return {

      ...state,

      route,
    };
  };

// ======================
// GRAPH BUILDER
// ======================

export const buildGraph =
  () => {

    const graph =
      new StateGraph({

        channels:
          graphState,
      });

    // Nodes

    graph.addNode(
      "router",
      routerNode
    );

    graph.addNode(
      "rag",
      ragNode
    );

    graph.addNode(
      "summary",
      summaryNode
    );

    graph.addNode(
      "symptom",
      symptomNode
    );

    // Entry

    graph.setEntryPoint(
      "router"
    );

    // Routing

    graph.addConditionalEdges(

      "router",

      (state) =>
        state.route,

      {

        rag:
          "rag",

        summary:
          "summary",

        symptom:
          "symptom",
      }
    );

    // Finish

    graph.setFinishPoint(
      "rag"
    );

    graph.setFinishPoint(
      "summary"
    );

    graph.setFinishPoint(
      "symptom"
    );

    return graph.compile();
  };