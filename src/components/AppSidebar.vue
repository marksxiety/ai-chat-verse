<template>
    <Sidebar>
        <SidebarHeader class="p-4">
            <div class="flex items-center gap-4">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-secondary">
                    <Icon icon="ri:chat-ai-line" width="24" height="24" />
                </div>
                <div>
                    <h1 class="text-sm tracking-wider font-semibold uppercase">AI Chat Verse</h1>
                    <p class="text-xs text-muted-foreground">Your AI Assistant</p>
                </div>
            </div>
        </SidebarHeader>

        <SidebarContent class="p-2">
            <SidebarGroup>
                <div class="mb-6">
                    <Button @click="handleNewChat" class="w-full flex gap-6 p-6">
                        <Icon icon="pajamas:duo-chat-new" width="16" height="16" />
                        New Chat
                    </Button>
                </div>
                <Separator class="mb-3" />
                <div class="space-y-4 mb-4">
                    <div>
                        <label
                            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Provider</label>
                        <Select v-model="selectedProvider">
                            <SelectTrigger class="h-11 w-full">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="(info, provider) in providerModels" :key="provider"
                                        :value="provider">
                                        <div class="flex items-center gap-2">
                                            <Icon :icon="info.icon" class="h-4 w-4" />
                                            {{ info.label }}
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label
                            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Model</label>
                        <Select v-model="selectedModel">
                            <SelectTrigger class="h-11 w-full">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="model in availableModels" :key="model.value"
                                        :value="model.value">
                                        {{ model.label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator class="my-3" />

                <SidebarGroupLabel class="px-2 text-xs text-muted-foreground mb-3">
                    Recent Chats
                </SidebarGroupLabel>

                <ScrollArea class="h-[calc(90vh-400px)] -mr-2">
                    <SidebarMenu>
                        <SidebarMenuItem v-for="chat in chatHistory.sortedChats" :key="chat.id">
                            <SidebarMenuButton as-child :class="chatHistory.currentChatId === chat.id && 'bg-accent'"
                                class="h-auto p-2">
                                <a href="#" @click.prevent="chatHistory.selectChat(chat.id)"
                                    class="flex flex-1 flex-col items-start gap-0.3 overflow-hidden">
                                    <span class="w-full truncate text-sm font-medium">{{ chat.title }}</span>
                                    <span class="text-xs text-muted-foreground">{{ formatTimestamp(chat.timestamp)
                                    }}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                    <!-- Empty state -->
                    <div v-if="chatHistory.chats.length === 0"
                        class="flex flex-col items-center justify-center py-12 px-4">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <Icon icon="lucide:message-square" class="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p class="text-sm text-muted-foreground">No chats yet</p>
                        <p class="text-xs text-muted-foreground/70 mt-1">Start a conversation to begin</p>
                    </div>
                </ScrollArea>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter class="p-4 border-t border-border/50 bg-muted/20">
            <div class="text-xs text-muted-foreground flex items-center gap-2">
                <Icon icon="lucide:info" class="h-3 w-3" />
                <span>v1.0.0</span>
            </div>
        </SidebarFooter>
    </Sidebar>
</template>

<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import type { Provider, ProviderModels } from '@/types'
import { useModelProviderStore } from '@/stores/ModelProviderStore'
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'
import chatHistoryData from '@/data/chatHistory.json'
import ProviderModelsData from '@/data/ProviderModels.json'

const modelProvider = useModelProviderStore()
const chatHistory = useChatHistoryStore()

const selectedProvider = ref<Provider>('openai')
const selectedModel = ref<string>('gpt-4o-mini')

const providerModels: ProviderModels = ProviderModelsData ?? {}

const getModelLabel = (modelValue: string) => {
    for (const provider in providerModels) {
        const model = providerModels[provider]?.models.find(m => m.value === modelValue)
        if (model) return model.label
    }
    return modelValue
}

const availableModels = computed(() => {
    return providerModels[selectedProvider.value]?.models || []
})

// Chat history functions
function handleNewChat() {
    chatHistory.createNewChat()
}

function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return date.toLocaleDateString()
}

watch(selectedProvider, (newProvider) => {
    const providerInfo = providerModels[newProvider]
    if (providerInfo?.models && providerInfo.models.length > 0) {
        const firstModel = providerInfo.models[0]
        if (firstModel) {
            selectedModel.value = firstModel.value
        }
    }
    modelProvider.setProvider(newProvider, providerInfo?.label || newProvider)
})

watch(selectedModel, (newModel) => {
    modelProvider.setModel(newModel, getModelLabel(newModel))
})

onMounted(() => {
    // Load chat history data
    chatHistory.loadChats(chatHistoryData)

    const providerInfo = providerModels[selectedProvider.value]
    modelProvider.setProvider(selectedProvider.value, providerInfo?.label || selectedProvider.value)
    modelProvider.setModel(selectedModel.value, getModelLabel(selectedModel.value))
})
</script>