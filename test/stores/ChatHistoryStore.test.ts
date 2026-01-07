/**
 * Tests for ChatHistoryStore
 *
 * This test suite verifies comprehensive chat history management:
 * 1. Chat CRUD operations (create, read, update, delete)
 * 2. Message management within chats
 * 3. Auto-generated titles from messages
 * 4. Chat sorting and selection
 * 5. State management and computed properties
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChatHistoryStore } from '../../src/stores/ChatHistoryStore'

// Mock the streaming composable to avoid actual API calls during tests
vi.mock('@/composables/useMultiProviderStream', () => ({
  useMultiProviderStream: () => ({
    streamMessage: vi.fn(),
    isStreaming: { value: false },
    streamedContent: { value: '' }
  })
}))

describe('useChatHistoryStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test to ensure isolation
    setActivePinia(createPinia())
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    // Arrange & Act: Initialize store
    const store = useChatHistoryStore()

    // Assert: Verify initial state is empty
    expect(store.chats).toHaveLength(0)
    expect(store.currentChatId).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.apiSuccess).toBeNull()
  })

  it('should load chats from data', () => {
    // Arrange: Initialize store and create mock chat data
    const store = useChatHistoryStore()
    const mockChats = [
      {
        id: '1',
        title: 'Test Chat',
        timestamp: '2024-01-01',
        messages: []
      }
    ]

    // Act: Load chats into store
    store.loadChats(mockChats)

    // Assert: Verify chats were loaded
    expect(store.chats).toEqual(mockChats)
  })

  it('should create a new chat', () => {
    // Arrange: Initialize store
    const store = useChatHistoryStore()

    // Act: Create a new chat with custom title
    const newChat = store.createNewChat('My New Chat')

    // Assert: Verify chat was created and set as current
    expect(newChat.title).toBe('My New Chat')
    expect(store.chats).toHaveLength(1)
    expect(store.chats[0]!.id).toBe(newChat.id)
    expect(store.currentChatId).toBe(newChat.id)
    expect(newChat.messages).toHaveLength(0)
  })

  it('should create a new chat with default title', () => {
    // Arrange: Initialize store
    const store = useChatHistoryStore()

    // Act: Create a new chat without title
    const newChat = store.createNewChat()

    // Assert: Verify default title is used
    expect(newChat!.title).toBe('New Chat')
  })

  it('should select a chat by id', () => {
    // Arrange: Initialize store with multiple chats
    const store = useChatHistoryStore()
    store.loadChats([
      { id: '1', title: 'Chat 1', timestamp: '2024-01-01', messages: [] },
      { id: '2', title: 'Chat 2', timestamp: '2024-01-02', messages: [] }
    ])

    // Act: Select the second chat
    store.selectChat('2')

    // Assert: Verify current chat was updated
    expect(store.currentChatId).toBe('2')
    expect(store.currentChat?.id).toBe('2')
  })

  it('should add a user message', () => {
    // Arrange: Initialize store and create a new chat
    const store = useChatHistoryStore()
    store.createNewChat()

    // Act: Add a user message
    store.addMessage('user', 'Hello world')

    // Assert: Verify message was added with correct role and content
    expect(store.currentChat?.messages).toHaveLength(1)
    expect(store.currentChat!.messages[0]!.role).toBe('user')
    expect(store.currentChat!.messages[0]!.content).toBe('Hello world')
  })

  it('should add an assistant message', () => {
    // Arrange: Initialize store and create a new chat
    const store = useChatHistoryStore()
    store.createNewChat()

    // Act: Add an assistant message
    store.addMessage('assistant', 'Hi there!')

    // Assert: Verify message was added with correct role
    expect(store.currentChat?.messages).toHaveLength(1)
    expect(store.currentChat!.messages[0]!.role).toBe('assistant')
  })

  it('should create new chat when adding message and no current chat exists', () => {
    // Arrange: Initialize store without creating a chat
    const store = useChatHistoryStore()

    // Act: Add a message (should auto-create chat)
    store.addMessage('user', 'Test')

    // Assert: Verify new chat was created and message added
    expect(store.chats).toHaveLength(1)
    expect(store.currentChat?.messages).toHaveLength(1)
  })

  it('should auto-generate title from first user message', () => {
    // Arrange: Initialize store and create a new chat
    const store = useChatHistoryStore()
    store.createNewChat()

    // Act: Add a long user message
    store.addMessage('user', 'This is a very long message that should be truncated to fifty characters')

    // Assert: Verify title was auto-generated and truncated to 50 chars
    expect(store.currentChat?.title).toBe('This is a very long message that should be truncat...')
  })

  it('should delete a chat', () => {
    // Arrange: Initialize store with two chats and select second
    const store = useChatHistoryStore()
    store.loadChats([
      { id: '1', title: 'Chat 1', timestamp: '2024-01-01', messages: [] },
      { id: '2', title: 'Chat 2', timestamp: '2024-01-02', messages: [] }
    ])
    store.selectChat('2')

    // Act: Delete the first chat
    store.deleteChat('1')

    // Assert: Verify chat was deleted and only second remains
    expect(store.chats).toHaveLength(1)
    expect(store.chats[0]!.id).toBe('2')
  })

  it('should update current chat id when deleting current chat', () => {
    // Arrange: Initialize store with two chats and select first
    const store = useChatHistoryStore()
    store.loadChats([
      { id: '1', title: 'Chat 1', timestamp: '2024-01-01', messages: [] },
      { id: '2', title: 'Chat 2', timestamp: '2024-01-02', messages: [] }
    ])
    store.selectChat('1')

    // Act: Delete the currently selected chat
    store.deleteChat('1')

    // Assert: Verify current chat was updated to remaining chat
    expect(store.currentChatId).toBe('2')
  })

  it('should clear current chat messages', () => {
    // Arrange: Initialize store, create chat and add messages
    const store = useChatHistoryStore()
    store.createNewChat()
    store.addMessage('user', 'Test 1')
    store.addMessage('assistant', 'Test 2')

    // Act: Clear all messages from current chat
    store.clearCurrentChat()

    // Assert: Verify messages were cleared
    expect(store.currentChat?.messages).toHaveLength(0)
  })

  it('should update chat title', () => {
    // Arrange: Initialize store with a chat
    const store = useChatHistoryStore()
    store.loadChats([
      { id: '1', title: 'Chat 1', timestamp: '2024-01-01', messages: [] }
    ])

    // Act: Update the chat title
    store.updateChatTitle('1', 'Updated Title')

    // Assert: Verify title was updated
    expect(store.chats[0]!.title).toBe('Updated Title')
  })

  it('should sort chats by timestamp (most recent first)', () => {
    // Arrange: Initialize store with chats in different timestamps (out of order)
    const store = useChatHistoryStore()
    store.loadChats([
      { id: '1', title: 'Chat 1', timestamp: '2024-01-01', messages: [] },
      { id: '2', title: 'Chat 2', timestamp: '2024-01-03', messages: [] },
      { id: '3', title: 'Chat 3', timestamp: '2024-01-02', messages: [] }
    ])

    // Assert: Verify chats are sorted by timestamp (most recent first)
    expect(store.sortedChats[0]!.id).toBe('2')  // 2024-01-03
    expect(store.sortedChats[1]!.id).toBe('3')  // 2024-01-02
    expect(store.sortedChats[2]!.id).toBe('1')  // 2024-01-01
  })

  it('should return current messages correctly', () => {
    // Arrange: Initialize store, create chat and add messages
    const store = useChatHistoryStore()
    store.createNewChat()
    store.addMessage('user', 'Test 1')
    store.addMessage('assistant', 'Test 2')

    // Act: Get current messages via computed property
    const messages = store.currentMessages

    // Assert: Verify all messages are returned in order
    expect(messages).toHaveLength(2)
    expect(messages[0]!.content).toBe('Test 1')
    expect(messages[1]!.content).toBe('Test 2')
  })
})
