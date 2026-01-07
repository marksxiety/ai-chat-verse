/**
 * Tests for ModelProviderStore
 *
 * This test suite verifies the state management for AI provider and model selection:
 * 1. Initial state values
 * 2. Provider and model setting functionality
 * 3. Computed property updates
 * 4. Multiple updates behavior
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useModelProviderStore } from '../../src/stores/ModelProviderStore'

describe('useModelProviderStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test to ensure isolation
    setActivePinia(createPinia())
  })

  it('should initialize with empty values', () => {
    // Arrange & Act: Initialize store
    const store = useModelProviderStore()

    // Assert: Verify initial state is empty strings
    expect(store.getProviderValue).toBe('')
    expect(store.getProviderLabel).toBe('')
    expect(store.getModelValue).toBe('')
    expect(store.getModelLabel).toBe('')
  })

  it('should set provider correctly', () => {
    // Arrange: Initialize store
    const store = useModelProviderStore()

    // Act: Set provider with value and label
    store.setProvider('openai', 'OpenAI')

    // Assert: Verify provider state was updated
    expect(store.getProviderValue).toBe('openai')
    expect(store.getProviderLabel).toBe('OpenAI')
  })

  it('should set model correctly', () => {
    // Arrange: Initialize store
    const store = useModelProviderStore()

    // Act: Set model with value and label
    store.setModel('gpt-4', 'GPT-4')

    // Assert: Verify model state was updated
    expect(store.getModelValue).toBe('gpt-4')
    expect(store.getModelLabel).toBe('GPT-4')
  })

  it('should update provider when setProvider is called multiple times', () => {
    // Arrange: Initialize store
    const store = useModelProviderStore()

    // Act: Set provider to openai first, then to anthropic
    store.setProvider('openai', 'OpenAI')
    expect(store.getProviderValue).toBe('openai')

    store.setProvider('anthropic', 'Anthropic')
    expect(store.getProviderValue).toBe('anthropic')
    expect(store.getProviderLabel).toBe('Anthropic')
  })

  it('should update model when setModel is called multiple times', () => {
    // Arrange: Initialize store
    const store = useModelProviderStore()

    // Act: Set model to gpt-4 first, then to gpt-3.5-turbo
    store.setModel('gpt-4', 'GPT-4')
    expect(store.getModelValue).toBe('gpt-4')

    store.setModel('gpt-3.5-turbo', 'GPT-3.5 Turbo')
    expect(store.getModelValue).toBe('gpt-3.5-turbo')
    expect(store.getModelLabel).toBe('GPT-3.5 Turbo')
  })
})
