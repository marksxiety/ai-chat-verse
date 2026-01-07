export function processMessages(provider, providerProcessors, messages) {
  const processMessagesFunc = providerProcessors[provider] || providerProcessors.default
  return processMessagesFunc(messages)
}

export function createStreamHandler(getClientProvider, providerProcessors) {
  return async function streamHandler(req, res) {
    const { messages, model, provider } = req.body

    try {
      if (!provider || !messages || !model) {
        return res.status(400).json({ error: 'Missing provider, messages, or model.' })
      }

      const client = getClientProvider(provider)
      const finalMessages = processMessages(provider, providerProcessors, messages)

      const result = await client.chat.completions.create({
        model: model,
        messages: finalMessages,
        stream: true,
      })

      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')

      for await (const chunk of result) {
        const delta = chunk.choices?.[0]?.delta?.content
        if (delta) {
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`)
        }
      }

      res.write('data: [DONE]\n\n')
      res.end()
    } catch (error) {
      console.error(`Error with provider ${provider}:`, error.message)

      if (!res.headersSent) {
        res.status(500).json({ error: error.message })
      } else {
        res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`)
        res.end()
      }
    }
  }
}
