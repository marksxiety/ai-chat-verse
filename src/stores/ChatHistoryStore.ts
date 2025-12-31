import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMultiProviderStream } from '@/composables/useMultiProviderStream'

interface Message {
    id: string
    role: string
    content: string
}

interface Chat {
    id: string
    title: string
    timestamp: string
    messages: Message[]
}

export const useChatHistoryStore = defineStore('chatHistory', () => {
    // State
    const chats = ref<Chat[]>([])
    const currentChatId = ref<string | null>(null)
    const isLoading = ref(false)
    const apiSuccess = ref<boolean | null>(null)

    // Computed
    const currentChat = computed(() => {
        return chats.value.find(chat => chat.id === currentChatId.value) || null
    })

    const currentMessages = computed(() => {
        return currentChat.value?.messages || []
    })

    const sortedChats = computed(() => {
        return [...chats.value].sort((a, b) => {
            // Sort by timestamp (most recent first)
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })
    })

    // Actions
    function loadChats(chatData: Chat[]) {
        chats.value = chatData
    }

    function createNewChat(title: string = 'New Chat') {
        const newChat: Chat = {
            id: Date.now().toString(),
            title,
            timestamp: new Date().toISOString(),
            messages: []
        }
        chats.value.unshift(newChat)
        currentChatId.value = newChat.id
        return newChat
    }

    function selectChat(chatId: string) {
        currentChatId.value = chatId
    }

    function addMessage(role: 'user' | 'assistant', content: string) {
        if (!currentChat.value) {
            createNewChat()
        }

        const newMessage: Message = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role,
            content
        }

        currentChat.value!.messages.push(newMessage)

        // Update timestamp
        currentChat.value!.timestamp = new Date().toISOString()

        // Auto-generate title from first user message if still "New Chat"
        if (currentChat.value!.title === 'New Chat' && role === 'user') {
            currentChat.value!.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
        }
    }

    function deleteChat(chatId: string) {
        const index = chats.value.findIndex(chat => chat.id === chatId)
        if (index !== -1) {
            chats.value.splice(index, 1)
            if (currentChatId.value === chatId) {
                currentChatId.value = chats.value[0]?.id || null
            }
        }
    }

    function updateChatTitle(chatId: string, newTitle: string) {
        const chat = chats.value.find(chat => chat.id === chatId)
        if (chat) {
            chat.title = newTitle
        }
    }

    function clearCurrentChat() {
        if (currentChat.value) {
            currentChat.value.messages = []
        }
    }

    async function sendMessage(userMessage: string) {
        if (!currentChat.value) {
            createNewChat()
        }

        isLoading.value = true
        apiSuccess.value = null
        addMessage('user', userMessage)

        const { streamMessage, apiSuccess: streamApiSuccess } = useMultiProviderStream()

        const messages = currentMessages.value.map(msg => ({
            role: msg.role,
            content: msg.content
        }))

        let assistantMessageId: string | null = null

        try {
            await streamMessage(messages, (chunk: string) => {
                if (!assistantMessageId) {
                    addMessage('assistant', chunk)
                    const lastMessage = currentChat.value?.messages[currentChat.value.messages.length - 1]
                    if (lastMessage) {
                        assistantMessageId = lastMessage.id
                        isLoading.value = false
                    }

                    isLoading.value = false
                } else {
                    const messageToUpdate = currentChat.value?.messages.find(m => m.id === assistantMessageId)
                    if (messageToUpdate) {
                        messageToUpdate.content += chunk
                    }
                }
            })

            apiSuccess.value = streamApiSuccess.value
            return [true, '']
        } catch (error) {
            isLoading.value = false
            apiSuccess.value = false
            return [false, `Request failed:  ${error}`]
        } finally {
            isLoading.value = false
            return [false, '']
        }
    }
    return {
        // State
        chats,
        currentChatId,
        isLoading,
        apiSuccess,

        // Computed
        currentChat,
        currentMessages,
        sortedChats,

        // Actions
        loadChats,
        createNewChat,
        selectChat,
        addMessage,
        deleteChat,
        updateChatTitle,
        clearCurrentChat,
        sendMessage
    }
})