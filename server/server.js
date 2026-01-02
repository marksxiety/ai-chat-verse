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
    try {
      configProviderData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      console.error("Failed to load ProviderModels.json:", err);
      return {};
    }
  }
  return configProviderData;
};

// Add any unique logic here for specific providers.
const providerProcessors = {
  zhipu: (messages) => {
    const systemInstruction = {
      role: "system",
      content:
        "You are a helpful coding assistant. You must respond strictly in English unless the user specifically asks you to speak in another language.",
    };
    return [systemInstruction, ...messages];
  },
  // Default processor: just returns messages as-is
  default: (messages) => messages,
};

const getClientProvider = (provider) => {
  const configData = loadConfigData();
  const providerConfig = configData[provider];

  if (!providerConfig) {
    throw new Error(`Provider "${provider}" not found in config.`);
  }

  const apiKeyEnvName = `${provider.toUpperCase()}_API_KEY`;
  const apiKey = process.env[apiKeyEnvName];

  if (!apiKey) {
    throw new Error(`API Key for ${provider} is missing in .env`);
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: providerConfig.baseUrl,
  });
};

app.post("/api/chat", async (req, res) => {
  const { messages, model, provider } = req.body;

  try {
    if (!provider || !messages || !model) {
      return res
        .status(400)
        .json({ error: "Missing provider, messages, or model." });
    }

    const client = getClientProvider(provider);

    // Run provider-specific message processing
    const processMessages =
      providerProcessors[provider] || providerProcessors.default;
    const finalMessages = processMessages(messages);

    const result = await client.chat.completions.create({
      model: model,
      messages: finalMessages,
      stream: true,
    });

    // Unified SSE (Server-Sent Events) Headers
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
    console.error(`Error with provider ${provider}:`, error.message);

    // If headers haven't been sent, we can send a 500.
    // If they have, we have to end the stream.
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    }
  }
});

// --- 5. SERVER START ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Chat Verse Server running on port ${PORT}`);
});
