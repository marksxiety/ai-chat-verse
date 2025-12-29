import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
        isLoading.value = true
        addMessage('user', userMessage)

        const sampleResponses = [
            "That's an interesting question! Let me think about it for a moment. Based on my knowledge, I'd say the key consideration here is understanding the context and applying the right principles.",
            "Great question! Here's what I can tell you about that. The main thing to remember is that there are multiple approaches, and the best one depends on your specific situation.",
            "I'd be happy to help with that! The short answer is that it depends on several factors. Let me explain the key considerations in more detail.",
            "That's a thoughtful question. In my experience, the most important factors to consider are the requirements, constraints, and goals of your particular use case.",
            "Excellent question! There are several ways to approach this, and I'll walk you through the most common and effective methods."
        ]

        await new Promise(resolve => setTimeout(resolve, 1500))
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
        if (randomResponse) {
            addMessage('assistant', randomResponse)
        } else {
            addMessage('assistant', 'Something error occured.')
        }

        isLoading.value = false
    }

    return {
        // State
        chats,
        currentChatId,
        isLoading,

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