import { StateGraph } from "@langchain/langgraph";
import {

  ragNode,

  summaryNode,

  symptomNode

} from "./langgraphNodes.js";

const graphState = {

  question: null,

  route: null,

  answer: null,
};

const routerNode =
  async (state) => {

    const question =
      state.question
        ?.toLowerCase() || "";

    console.log(
      "LANGGRAPH ROUTER:",
      question
    );

    if (

      question.includes(
        "summary"
      ) ||

      question.includes(
        "summarize"
      )

    ) {

      return {
        ...state,
        route: "summary",
      };
    }

    if (

      question.includes(
        "pain"
      ) ||

      question.includes(
        "fever"
      ) ||

      question.includes(
        "symptom"
      )

    ) {

      return {
        ...state,
        route: "symptom",
      };
    }

    return {
      ...state,
      route: "rag",
    };
  };

export const buildGraph =
  () => {

    const graph =
      new StateGraph({
        channels:
          graphState,
      });

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

    graph.setEntryPoint(
      "router"
    );

    graph.addConditionalEdges(

      "router",

      (state) => {

        return state.route;
      },

      {

        rag:
          "rag",

        summary:
          "summary",

        symptom:
          "symptom",
      }
    );

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