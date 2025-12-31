import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let configProviderData = null;

const loadConfigData = () => {
  if (!configProviderData) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, "../src/data/ProviderModels.json");
    configProviderData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return configProviderData;
};

const getClientProvider = (provider) => {
  const configData = loadConfigData();

  const APIKEY = `${provider.toUpperCase()}_API_KEY`;
  const URL = configData[provider]?.baseUrl;

  return new OpenAI({
    apiKey: process.env[APIKEY],
    baseURL: URL,
  });
};

app.post("/api/chat/openai", async (req, res) => {
  try {
    const client = getClientProvider("openai");

    const { messages, model } = req.body;

    const result = await client.chat.completions.create({
      model: model,
      messages,
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of result) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/chat/zhipu", async (req, res) => {
  try {
    const client = getClientProvider("openai");

    const { messages, model } = req.body;

    const systemInstruction = {
      role: "system",
      content:
        "You are a helpful coding assistant. You must respond strictly in English unless the user specifically asks you to speak in another language.",
    };

    const finalMessages = [systemInstruction, ...messages];

    const result = await client.chat.completions.create({
      model: model,
      messages: finalMessages,
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of result) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
