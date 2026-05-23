export const ragNode =
  async (state) => {

    console.log(
      "RAG NODE"
    );

    return {

      ...state,

      node:
        "rag",
    };
  };

export const summaryNode =
  async (state) => {

    console.log(
      "SUMMARY NODE"
    );

    return {

      ...state,

      node:
        "summary",
    };
  };

export const symptomNode =
  async (state) => {

    console.log(
      "SYMPTOM NODE"
    );

    return {

      ...state,

      node:
        "symptom",
    };
  };