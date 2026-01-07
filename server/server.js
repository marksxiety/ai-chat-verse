import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  createLoadConfigData,
  createGetClientProvider,
  providerProcessors,
} from './services.js'
import { createStreamHandler } from './streamHandler.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configFilePath = path.join(__dirname, '../src/data/ProviderModels.json')
const loadConfigData = createLoadConfigData(configFilePath)
const getClientProvider = createGetClientProvider(loadConfigData)

app.post(
  '/api/chat',
  createStreamHandler(getClientProvider, providerProcessors)
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`AI Chat Verse Server running on port ${PORT}`)
})
