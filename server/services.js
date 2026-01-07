import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import OpenAI from 'openai'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const providerProcessors = {
  zhipu: (messages) => {
    const systemInstruction = {
      role: 'system',
      content:
        'You are a helpful coding assistant. You must respond strictly in English unless the user specifically asks you to speak in another language.',
    }
    return [systemInstruction, ...messages]
  },
  default: (messages) => messages,
}

export function createLoadConfigData(filePath) {
  let configProviderData = null

  return function loadConfigData() {
    if (!configProviderData) {
      try {
        const data = fs.readFileSync(filePath, 'utf8')
        configProviderData = JSON.parse(data)
      } catch (err) {
        console.error('Failed to load ProviderModels.json:', err)
        return {}
      }
    }
    return configProviderData
  }
}

export function createGetClientProvider(loadConfigData, env = process.env, OpenAIClass = OpenAI) {
  return function getClientProvider(provider) {
    const configData = loadConfigData()
    const providerConfig = configData[provider]

    if (!providerConfig) {
      throw new Error(`Provider "${provider}" not found in config.`)
    }

    const apiKeyEnvName = `${provider.toUpperCase()}_API_KEY`
    const apiKey = env[apiKeyEnvName]

    if (!apiKey) {
      throw new Error(`API Key for ${provider} is missing in .env`)
    }

    return new OpenAIClass({
      apiKey: apiKey,
      baseURL: providerConfig.baseUrl,
    })
  }
}
