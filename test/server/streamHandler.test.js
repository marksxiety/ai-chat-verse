/**
 * Tests for streaming handler and message processing
 *
 * This test suite verifies:
 * 1. Message processing with provider-specific logic
 * 2. Server-Sent Events (SSE) streaming implementation
 * 3. Error handling for different scenarios (headers sent/not sent)
 * 4. Input validation (missing required fields)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createStreamHandler, processMessages } from '../../server/streamHandler.js'
import { providerProcessors } from '../../server/services.js'

describe('processMessages', () => {
  // Mock provider processors for testing
  const providerProcessors = {
    zhipu: vi.fn((messages) => [{ role: 'system', content: 'test' }, ...messages]),
    default: vi.fn((messages) => messages)
  }

  it('should use provider-specific processor when available', () => {
    // Arrange: Create test messages
    const messages = [{ role: 'user', content: 'test' }]

    // Act: Process messages for zhipu provider
    processMessages('zhipu', providerProcessors, messages)

    // Assert: Verify zhipu processor was called
    expect(providerProcessors.zhipu).toHaveBeenCalledWith(messages)
  })

  it('should use default processor when provider not found', () => {
    // Arrange: Create test messages
    const messages = [{ role: 'user', content: 'test' }]

    // Act: Process messages for unknown provider
    processMessages('unknown', providerProcessors, messages)

    // Assert: Verify default processor was called as fallback
    expect(providerProcessors.default).toHaveBeenCalledWith(messages)
  })
})

describe('createStreamHandler', () => {
  // Setup mock objects for request, response, and OpenAI client
  let mockReq, mockRes, mockClient, getClientProvider

  beforeEach(() => {
    // Reset and initialize mock request object
    mockReq = {
      body: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello' }]
      }
    }

    // Reset and initialize mock response object
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      setHeader: vi.fn(),
      write: vi.fn(),
      end: vi.fn(),
      headersSent: false
    }

    // Reset and initialize mock OpenAI client
    mockClient = {
      chat: {
        completions: {
          create: vi.fn()
        }
      }
    }

    // Mock the client provider function
    getClientProvider = vi.fn(() => mockClient)
  })

  it('should return 400 when provider is missing', async () => {
    // Arrange: Create request without provider
    mockReq.body = { model: 'gpt-4', messages: [] }

    // Act: Call the handler
    const handler = createStreamHandler(getClientProvider, providerProcessors)
    await handler(mockReq, mockRes)

    // Assert: Verify error response
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Missing provider, messages, or model.'
    })
  })

  it('should return 400 when messages is missing', async () => {
    // Arrange: Create request without messages
    mockReq.body = { provider: 'openai', model: 'gpt-4' }

    // Act: Call the handler
    const handler = createStreamHandler(getClientProvider, providerProcessors)
    await handler(mockReq, mockRes)

    // Assert: Verify error response
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Missing provider, messages, or model.'
    })
  })

  it('should set SSE headers and stream data', async () => {
    // Arrange: Create a mock async generator for streaming response
    const mockStream = (async function* () {
      yield { choices: [{ delta: { content: 'Hello' } }] }
      yield { choices: [{ delta: { content: ' World' } }] }
    })()

    // Mock the OpenAI create method to return our stream
    mockClient.chat.completions.create.mockResolvedValue(mockStream)

    // Act: Call the handler
    const handler = createStreamHandler(getClientProvider, providerProcessors)
    await handler(mockReq, mockRes)

    // Assert: Verify SSE headers and streaming data
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream')
    expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache')
    expect(mockRes.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive')
    expect(mockRes.write).toHaveBeenCalledWith('data: {"content":"Hello"}\n\n')
    expect(mockRes.write).toHaveBeenCalledWith('data: {"content":" World"}\n\n')
    expect(mockRes.write).toHaveBeenCalledWith('data: [DONE]\n\n')
    expect(mockRes.end).toHaveBeenCalled()
  })

  it('should handle errors when headers not sent', async () => {
    // Arrange: Mock an API error and ensure headers aren't sent
    const error = new Error('API Error')
    mockClient.chat.completions.create.mockRejectedValue(error)
    mockRes.headersSent = false

    // Act: Call the handler
    const handler = createStreamHandler(getClientProvider, providerProcessors)
    await handler(mockReq, mockRes)

    // Assert: Verify 500 error response
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'API Error' })
  })

  it('should handle errors when headers already sent', async () => {
    // Arrange: Mock an API error with headers already sent (streaming in progress)
    const error = new Error('API Error')
    mockClient.chat.completions.create.mockRejectedValue(error)
    mockRes.headersSent = true

    // Act: Call the handler
    const handler = createStreamHandler(getClientProvider, providerProcessors)
    await handler(mockReq, mockRes)

    // Assert: Verify error is written to stream instead of JSON response
    expect(mockRes.write).toHaveBeenCalledWith(
      'data: {"error":"Stream interrupted"}\n\n'
    )
    expect(mockRes.end).toHaveBeenCalled()
  })
})
