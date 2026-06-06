import { StateGraph, Annotation } from "@langchain/langgraph";
import { GoogleGenAI } from "@google/genai";
import {

  ragNode,

  summaryNode,

  symptomNode,

  memoryNode,

  mergeNode

} from "./langgraphNodes.js";

const ai =
  new GoogleGenAI({

    apiKey:
      process.env.GEMINI_API_KEY,
  });

// ======================
// GRAPH STATE
// ======================

const graphState =
  Annotation.Root({

    question:
      Annotation(),

    agent:
      Annotation(),

    answer:
      Annotation(),

    relevantChunks:
      Annotation(),

    aiResponse:
      Annotation(),

    doctors:
      Annotation(),

    userId:
      Annotation(),

    history:
      Annotation(),

    cacheHit:
      Annotation(),

    selectedAgents:
      Annotation({

        default:
          () => [],
      }),

    partialAnswers:
      Annotation({

        reducer:
          (x, y) => {

            const merged = [

              ...(x || []),

              ...(y || [])
            ];

            return [

              ...new Set(
                merged
              )
            ];
          },

        default:
          () => [],
      }),
  });

// ======================
// SUPERVISOR AGENT
// ======================

const supervisorNode =
  async (state) => {

    const question =
      state.question
        ?.toLowerCase() || "";

    console.log(
      "SUPERVISOR AGENT:",
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

    // =================
    // FAST MULTI ROUTING
    // =================

    const selectedAgents = [];

    // symptom

    if (

      symptomKeywords.some(
        word =>
          question.includes(
            word
          )
      )

    ) {

      selectedAgents.push(
        "symptomAgent"
      );
    }

    // summary

    if (

      summaryKeywords.some(
        word =>
          question.includes(
            word
          )
      )

    ) {

      selectedAgents.push(
        "summaryAgent"
      );
    }

    // memory

    if (

      question.includes(
        "explain"
      ) ||

      question.includes(
        "more"
      ) ||

      question.includes(
        "continue"
      ) ||

      question.includes(
        "elaborate"
      )

    ) {

      selectedAgents.push(
        "memoryAgent"
      );
    }

    // FAST MATCH FOUND

    if (
      selectedAgents.length > 0
    ) {

      console.log(
        "FAST MULTI ROUTE:",
        selectedAgents
      );

      return {

        ...state,

        selectedAgents:
          [...new Set(
            selectedAgents
          )],
      };
    }

    // =================
    // LLM SUPERVISOR FALLBACK
    // =================

    // ======================
    // LLM FALLBACK
    // ======================

    console.log(
      "SUPERVISOR LLM FALLBACK"
    );

    try {

      const prompt = `

You are an AI supervisor.

Choose ONE agent only:

reportAgent
summaryAgent
symptomAgent
memoryAgent

Rules:

reportAgent:
- report questions
- factual retrieval
- scores
- projects
- uploaded file questions

summaryAgent:
- summarize
- overview
- report summary

symptomAgent:
- symptoms
- pain
- illness
- doctor recommendation

memoryAgent:
- follow-up questions
- explain more
- elaborate
- continue
- tell me more
- previous answer clarification

Return ONLY agent name.

Question:
${question}

`;

      const response =
        await ai.models.generateContent({

          model:
            "gemini-3.5-flash",

          contents:
            prompt,
        });

      const multiAgents = [];

      // summary

      if (

        question.includes(
          "summarize"
        )

      ) {

        multiAgents.push(
          "summaryAgent"
        );
      }

      // symptom

      if (

        question.includes(
          "pain"
        ) ||

        question.includes(
          "headache"
        ) ||

        question.includes(
          "dizzy"
        )

      ) {

        multiAgents.push(
          "symptomAgent"
        );
      }

      // memory

      if (

        question.includes(
          "explain"
        ) ||

        question.includes(
          "more"
        ) ||

        question.includes(
          "continue"
        )

      ) {

        multiAgents.push(
          "memoryAgent"
        );
      }

      // default

      if (

        multiAgents.length === 0

      ) {

        multiAgents.push(
          "reportAgent"
        );
      }

      console.log(
        "MULTI AGENTS:",
        multiAgents
      );

      return {

        ...state,

        selectedAgents:
          multiAgents,
      };

    }

    catch (err) {

      console.log(
        "SUPERVISOR FALLBACK ERROR:",
        err.message
      );

      // SAFE LOCAL FALLBACK

      if (

        question.includes(
          "explain"
        ) ||

        question.includes(
          "more"
        ) ||

        question.includes(
          "continue"
        )

      ) {

        return {

          ...state,

          selectedAgents:
            ["memoryAgent"]
        };
      }

      return {

        ...state,

        selectedAgents:
          ["reportAgent"],
      };
    }
  };

// ======================
// GRAPH BUILDER
// ======================

export const buildGraph =
  () => {

    const graph =
      new StateGraph(
        graphState
      );

    // =================
    // AGENTS
    // =================

    graph.addNode(
      "supervisor",
      supervisorNode
    );

    graph.addNode(
      "reportAgent",
      ragNode
    );

    graph.addNode(
      "summaryAgent",
      summaryNode
    );

    graph.addNode(
      "symptomAgent",
      symptomNode
    );

    graph.addNode(
      "memory",
      memoryNode
    );

    graph.addNode(
      "merge",
      mergeNode
    );

    // =================
    // ENTRY
    // =================

    graph.setEntryPoint(
      "supervisor"
    );

    // =================
    // SUPERVISOR ROUTING
    // =================

    graph.addConditionalEdges(

      "supervisor",

      (state) =>
        state.selectedAgents,

      {

        reportAgent:
          "reportAgent",

        summaryAgent:
          "summaryAgent",

        symptomAgent:
          "symptomAgent",

        memoryAgent:
          "memory",
      }
    );

    // =================
    // AGENTS → MERGE
    // =================

    graph.addEdge(
      "reportAgent",
      "merge"
    );

    graph.addEdge(
      "summaryAgent",
      "merge"
    );

    graph.addEdge(
      "symptomAgent",
      "merge"
    );

    graph.addEdge(
      "memory",
      "merge"
    );

    // =================
    // FINISH
    // =================

    graph.setFinishPoint(
      "merge"
    );

    return graph.compile();
  };