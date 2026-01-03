# AI Chat Verse

A modern multi-LLM chat interface that lets you switch between AI providers and models in one unified chat experience.

## Overview

AI Chat Verse is a lightweight chat application focused on **chat completions**, designed to support multiple AI providers and models under a single interface.

The provider and model list is configurable in `src/data/ProviderModels.json`.

## Supported Providers & Models

### OpenAI
- GPT-4o Mini (Budget) (`gpt-4o-mini`)
- GPT-5 Mini (2025 Budget) (`gpt-5-mini`)
- GPT-4o (`gpt-4o`)
- GPT-4.1 (`gpt-4.1`)

### Z.AI
- GLM-4.7 (`glm-4.7`)
- GLM-4.6 (`glm-4.6`)

### DeepSeek
- DeepSeek-V3.2 (General/Chat) (`deepseek-chat`)
- DeepSeek-V3.2 (Thinking/R1) (`deepseek-reasoner`)

## Limitations

- Currently supports only the providers and models listed above
- Focused exclusively on **chat completions** functionality
- Additional AI capabilities (e.g., image generation, audio processing) are not supported
- Provider and model list can be edited in `src/data/ProviderModels.json`

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chat-verse
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and add your API keys:
```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:
- `OPENAI_API_KEY=your_openai_api_key_here`
- `ZAI_API_KEY=your_zai_api_key_here`
- `DEEPSEEK_API_KEY=your_deepseek_api_key_here`
- `VITE_PORT=3001` (optional, default port)

4. Start the development servers:

Start UI only:
```bash
npm run dev
```

Start API only:
```bash
node server/server.js
```

Start both UI and API:
```bash
npm run dev:all
```

## Features

- Unified chat experience across multiple AI providers
- Provider and model switching
- Session-based chat history
- Chat completions–focused design
