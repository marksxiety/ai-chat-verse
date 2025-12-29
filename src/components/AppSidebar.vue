<template>
    <Sidebar>
        <SidebarHeader class="p-4">
            <div class="flex items-center gap-4">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-secondary">
                    <!-- <Icon icon="ri:chat-ai-line" class="h-4 w-4 text-3xl text-primary" /> -->
                    <Icon icon="ri:chat-ai-line" width="24" height="24" />
                </div>
                <div>
                    <h1 class="text-sm font-semibold uppercase">AI Chat Verse</h1>
                    <p class="text-xs  text-muted-foreground">Your AI Assistant</p>
                </div>
            </div>
        </SidebarHeader>

        <SidebarContent class="px-4 py-6">
            <SidebarGroup>
                <div class="mb-6">
                    <Button class="w-full flex gap-6 p-6">
                        <Icon icon="pajamas:duo-chat-new" width="16" height="16" />
                        New Chat
                    </Button>
                </div>

                <div class="space-y-4 mb-6">
                    <div>
                        <label
                            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Provider</label>
                        <Select v-model="provider">
                            <SelectTrigger class="h-11 w-full">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="openai">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:openai-fill" class="h-4 w-4" />
                                            OpenAI
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="anthropic">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:anthropic-fill" class="h-4 w-4" />
                                            Anthropic
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="google">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:google-fill" class="h-4 w-4" />
                                            Google
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

                <Separator class="my-6" />

                <SidebarGroupLabel
                    class="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Chats
                </SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem v-for="chat in recentChats" :key="chat.title">
                        <SidebarMenuButton as-child
                            class="h-11 px-3 rounded-lg hover:bg-muted/80 transition-all duration-200">
                            <a href="#" class="flex items-center gap-3">
                                <Icon icon="lucide:message-square" class="h-4 w-4 text-muted-foreground" />
                                <span class="flex-1 text-sm truncate text-left">{{ chat.title }}</span>
                                <span class="text-xs text-muted-foreground">{{ chat.date }}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
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
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import type { Provider, ProviderModels, RecentChats } from '@/types'

const provider = ref<Provider>('gpt')
const selectedModel = ref<string>('gpt-4o-mini')

const providerModels: ProviderModels = {
    openai: [
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4.1', label: 'GPT-4.1' }
    ],
    anthropic: [
        { value: 'claude-3-opus', label: 'Claude 3 Opus' },
        { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-haiku', label: 'Claude 3 Haiku' }
    ],
    google: [
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
    ]
}

const availableModels = computed(() => {
    return providerModels[provider.value] || []
})

watch(provider, (newProvider) => {
    const modelsForProvider = providerModels[newProvider]
    if (modelsForProvider && modelsForProvider.length > 0) {

        if (modelsForProvider[0]) {
            selectedModel.value = modelsForProvider[0].value
        }

    }
})

const recentChats: RecentChats = [
    { title: 'Chat about React', date: '2 hours ago' },
    { title: 'Python debugging', date: 'Yesterday' },
    { title: 'API design discussion', date: '3 days ago' },
]
</script>