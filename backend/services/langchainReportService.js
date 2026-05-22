import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3-flash-preview",
  temperature: 0.3,
});

const reportPrompt =
  PromptTemplate.fromTemplate(`

You are CuraDesk AI.

Answer using:

1. Current Question (highest priority)
2. Report Context
3. Conversation History (only for follow-up understanding)

Rules:

- ALWAYS prioritize the latest question.
- Use conversation history ONLY if the current question contains references like:
  "it", "that", "this", "explain", "more", "them".
- Do NOT answer based only on old history.
- If answer is not found in report context, say:
"I could not find this information in the uploaded report."

Conversation History:
{history}

Report Context:
{context}

Current Question:
{question}

Answer:

`);

export const askReportWithLangChain =
  async (
    history,
    context,
    question
  ) => {

    const prompt =
      await reportPrompt.format({
        history,
        context,
        question,
      });

    const response =
      await llm.invoke(prompt);

    return response.content;
  };