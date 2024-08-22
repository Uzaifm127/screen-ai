import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { questionSystemPrompt } from "@/lib/prompts";

export const maxDuration = 60;

export const POST = async () => {
  try {
    const geminiAPIKey = process.env.GEMINI_API_KEY;

    const chatModel = new ChatGoogleGenerativeAI({
      temperature: 0,
      apiKey: geminiAPIKey,
      modelName: "gemini-pro",
    });

    const resumePromptTemplate = ChatPromptTemplate.fromMessages([
      ["system", questionSystemPrompt],
      ["human", "{input}"],
    ]);

    const chain = resumePromptTemplate.pipe(chatModel);

    const res = await chain.invoke({
      input: "Generate 20 problems",
      skills: `
      - Javascript
        \n\n
      - CSS
        \n\n
      - Node.js
        \n\n
      - React
        \n\n
      - HTML
        \n\n
      - Tailwind CSS
        \n\n
      - Redux
        \n\n
      - Express
        \n\n
      - MongoDB
      `,
    });

    return NextResponse.json({
      output: JSON.parse(res.content.toString()),
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
