import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const zhipu = new OpenAI({
  apiKey: process.env.ZHIPU_API_KEY,
  baseURL: "https://api.z.ai/api/coding/paas/v4",
});

app.post("/api/chat/openai", async (req, res) => {
  try {
    const { messages, model } = req.body;

    const result = await openai.chat.completions.create({
      model: model || "gpt-4o-mini",
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
    const { messages, model } = req.body;

    const systemInstruction = {
      role: "system",
      content:
        "You are a helpful coding assistant. You must respond strictly in English unless the user specifically asks you to speak in another language.",
    };

    const finalMessages = [systemInstruction, ...messages];

    const result = await zhipu.chat.completions.create({
      model: model || "GLM-4.7",
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
