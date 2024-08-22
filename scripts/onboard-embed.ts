import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { config } from "dotenv";

config();

(async () => {
  try {
    const geminiAPIKey = process.env.GEMINI_API_KEY;
    const pineconeAPIKey = process.env.PINECONE_API_KEY;
    const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

    if (!geminiAPIKey) {
      throw new Error("Gemini API key is not set");
    }

    if (!pineconeAPIKey) {
      throw new Error("Pinecone API key is not set");
    }

    if (!pineconeIndexName) {
      throw new Error("Pinecone Index Name is not set");
    }

    const pinecone = new Pinecone({
      apiKey: pineconeAPIKey,
    });

    const pineconeIndex = pinecone.Index(pineconeIndexName);

    const loader = new DocxLoader("public/documents/Screen AI.docx");

    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 20,
    });

    const documentChunks = await splitter.splitDocuments(docs);

    const embedModel = new GoogleGenerativeAIEmbeddings({
      apiKey: geminiAPIKey,
      model: "embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    });

    await PineconeStore.fromDocuments(documentChunks, embedModel, {
      pineconeIndex,
    });

    console.log("Documents uploaded to Pinecone");
  } catch (error: any) {
    console.error(error.message);
  }
})();
