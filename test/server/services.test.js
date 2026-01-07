/**
 * Tests for server services (config loading, client creation, message processing)
 *
 * This test suite verifies:
 * 1. Provider message processors (zhipu, default)
 * 2. Configuration data loading from JSON files
 * 3. OpenAI client creation with proper validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  providerProcessors,
  createLoadConfigData,
  createGetClientProvider
} from '../../server/services.js'
import fs from 'fs'
import OpenAI from 'openai'

// Mock the fs module to avoid real file system operations during tests
vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn()
  }
}))

// Mock the OpenAI module to avoid creating real API clients
vi.mock('openai', () => ({
  default: vi.fn()
}))

describe('providerProcessors', () => {
  describe('zhipu processor', () => {
    it('should add system instruction to messages', () => {
      // Arrange: Create a test message array
      const messages = [
        { role: 'user', content: 'Hello' }
      ]

      // Act: Process messages through the zhipu provider
      const result = providerProcessors.zhipu(messages)

      // Assert: Verify system instruction is prepended
      expect(result).toHaveLength(2)
      expect(result[0].role).toBe('system')
      expect(result[0].content).toContain('coding assistant')
      expect(result[1]).toEqual(messages[0])
    })
  })

  describe('default processor', () => {
    it('should return messages as-is', () => {
      // Arrange: Create a test message array
      const messages = [
        { role: 'user', content: 'Hello' }
      ]

      // Act: Process messages through the default provider
      const result = providerProcessors.default(messages)

      // Assert: Verify messages are returned unchanged
      expect(result).toEqual(messages)
    })
  })
})

describe('createLoadConfigData', () => {
  beforeEach(() => {
    // Reset all mocks before each test to ensure isolation
    vi.clearAllMocks()
  })

  it('should load config data from file', () => {
    // Arrange: Mock the file content with provider configuration
    const mockData = {
      openai: {
        baseUrl: 'https://api.openai.com/v1',
        models: [{ value: 'gpt-4', label: 'GPT-4' }]
      }
    }
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

    // Act: Create the config loader and load data
    const loadConfigData = createLoadConfigData('test-path.json')
    const result = loadConfigData()

    // Assert: Verify file was read and data was parsed correctly
    expect(fs.readFileSync).toHaveBeenCalledWith('test-path.json', 'utf8')
    expect(result).toEqual(mockData)
  })

  it('should return cached data on subsequent calls', () => {
    // Arrange: Mock file content once
    const mockData = { test: 'data' }
    fs.readFileSync.mockReturnValueOnce(JSON.stringify(mockData))

    // Act: Call loadConfigData multiple times
    const loadConfigData = createLoadConfigData('test-path.json')
    const result1 = loadConfigData()
    const result2 = loadConfigData()

    // Assert: Verify file was read only once and both calls return same data
    expect(fs.readFileSync).toHaveBeenCalledTimes(1)
    expect(result1).toEqual(result2)
  })

  it('should handle file read errors', () => {
    // Arrange: Mock a file read error
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found')
    })

    // Act: Attempt to load config data
    const loadConfigData = createLoadConfigData('test-path.json')
    const result = loadConfigData()

    // Assert: Verify error is caught and empty object is returned
    expect(result).toEqual({})
  })
})

describe('createGetClientProvider', () => {
  // Mock configuration data used across tests
  const mockConfigData = {
    openai: {
      baseUrl: 'https://api.openai.com/v1'
    }
  }

  beforeEach(() => {
    // Reset mocks and set up environment variable
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-api-key'
  })

  it('should create OpenAI client for valid provider', () => {
    // Arrange: Mock dependencies and create client provider factory
    const mockLoadConfigData = vi.fn(() => mockConfigData)
    const MockOpenAI = vi.fn()
    const getClientProvider = createGetClientProvider(mockLoadConfigData, process.env, MockOpenAI)

    // Act: Create a client for the openai provider
    getClientProvider('openai')

    // Assert: Verify OpenAI client was created with correct configuration
    expect(MockOpenAI).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      baseURL: 'https://api.openai.com/v1'
    })
  })

  it('should throw error for unknown provider', () => {
    // Arrange: Mock dependencies
    const mockLoadConfigData = vi.fn(() => mockConfigData)
    const getClientProvider = createGetClientProvider(mockLoadConfigData, process.env, vi.fn())

    // Act & Assert: Verify error is thrown for unknown provider
    expect(() => getClientProvider('unknown')).toThrow(
      'Provider "unknown" not found in config.'
    )
  })

  it('should throw error when API key is missing', () => {
    // Arrange: Remove API key from environment and mock dependencies
    delete process.env.OPENAI_API_KEY
    const mockLoadConfigData = vi.fn(() => mockConfigData)
    const getClientProvider = createGetClientProvider(mockLoadConfigData, process.env, vi.fn())

    // Act & Assert: Verify error is thrown when API key is missing
    expect(() => getClientProvider('openai')).toThrow(
      'API Key for openai is missing in .env'
    )
  })
})
