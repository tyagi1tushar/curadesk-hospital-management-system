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

Answer ONLY using the provided medical report context.

If answer is not present in report, say:
"I could not find this information in the uploaded report."

Report Context:
{context}

Question:
{question}

Answer:

`);

export const askReportWithLangChain =
  async (
    context,
    question
  ) => {

    const prompt =
      await reportPrompt.format({
        context,
        question,
      });

    const response =
      await llm.invoke(prompt);

    return response.content;
  };