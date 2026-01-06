<template>
    <div class="max-h-[50vh]">
        <div v-if="chatHistory.currentMessages.length === 0"
            class="flex flex-1 flex-col items-center justify-center p-8">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Icon icon="mdi:message-plus" class="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 class="mt-4 text-xl font-semibold text-foreground">Start a conversation</h2>
            <p class="mt-2 max-w-md text-center text-sm text-muted-foreground">
                Choose your AI provider and model from the sidebar, then type a message to begin chatting.
            </p>
        </div>
        <div v-else class="space-y-6 animate-fade-in">
            <div v-for="message in chatHistory.currentMessages" :key="message.id"
                :class="['flex gap-4 animate-fade-in', message.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
                <div class='flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground'>
                    <Icon :icon="message.role === 'user' ? 'mdi:account' : 'mdi:robot'" class="h-5 w-5" />
                </div>

                <div :class="[
                    'max-w-[75%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                        ? 'border bg-primary text-primary-foreground rounded-tr-sm'
                        : 'border border-border bg-muted text-muted-foreground rounded-tl-sm'
                ]">
                    <MarkdownRenderer v-if="message.role === 'assistant'" :content="message.content" />
                    <p v-else class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
                </div>
            </div>
            <div v-if="chatHistory.isLoading" class="flex gap-4 animate-fade-in flex-row">
                <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                    <Icon icon="mdi:robot" class="h-5 w-5" />
                </div>
                <div
                    class="max-w-[75%] rounded-2xl px-4 py-3 border border-border bg-muted text-muted-foreground rounded-tl-sm">
                    <div class="flex items-center gap-1.5 py-1">
                        <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot" />
                        <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-1" />
                        <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-2" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'
import MarkdownRenderer from '@/components/MarkdownRenderer .vue'

const chatHistory = useChatHistoryStore()
</script>
