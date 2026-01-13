# AI Chat Verse

A unified multi-LLM chat interface for seamless switching between AI providers and models. Built for simplicity and focused on chat completions.

[![Tests](https://github.com/marksxiety/ai-chat-verse/actions/workflows/tests.yml/badge.svg)](https://github.com/marksxiety/ai-chat-verse/actions/workflows/tests.yml)
[![Build](https://github.com/marksxiety/ai-chat-verse/actions/workflows/build.yml/badge.svg)](https://github.com/marksxiety/ai-chat-verse/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/marksxiety/ai-chat-verse?color=blue)](https://github.com/marksxiety/ai-chat-verse/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%20%7C%2024.x-purple.svg)](https://nodejs.org/)

---

## Features

- **Multi-Provider Support** - Switch between OpenAI, Z.AI, and DeepSeek in one interface
- **Model Flexibility** - Choose from various models per provider
- **Session Management** - Persistent chat history across sessions
- **Lightweight Design** - Focused exclusively on chat completions
- **Easy Configuration** - JSON-based provider and model management

---

## Supported Providers

### OpenAI
- `gpt-4o-mini` - GPT-4o Mini (Budget)
- `gpt-5-mini` - GPT-5 Mini (2025 Budget)
- `gpt-4o` - GPT-4o
- `gpt-4.1` - GPT-4.1

### Z.AI
- `glm-4.7` - GLM-4.7
- `glm-4.6` - GLM-4.6

### DeepSeek
- `deepseek-chat` - DeepSeek-V3.2 (General/Chat)
- `deepseek-reasoner` - DeepSeek-V3.2 (Thinking/R1)

> **Customization:** Edit `src/data/ProviderModels.json` to modify providers and models.

---

## Quick Start

**Clone the repository**
```bash
git clone https://github.com/marksxiety/ai-chat-verse.git
cd ai-chat-verse
```

**Install dependencies**
```bash
npm install
```

**Configure API keys**
```bash
cp .env.example .env
```

Update `.env` with your credentials:
```env
OPENAI_API_KEY=your_openai_api_key_here
ZAI_API_KEY=your_zai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_PORT=3001  # Optional, default port
```

**Start development server**

UI only:
```bash
npm run dev
```

API only:
```bash
node server/server.js
```

Both UI and API:
```bash
npm run dev:all
```

Application available at `http://localhost:3001`

---

## Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

> **Note:** Use `npm run dev:all` for development. Reserve `npm run build` for production deployments.

---

## Current Limitations

This project is currently focused on core chat functionality:
- Supports only chat completions (no image generation, audio processing, etc.)
- Limited to providers and models listed above
- No streaming response support yet

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.