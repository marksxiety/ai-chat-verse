<template>
    <div class="flex-1 flex flex-col items-center h-full min-h-0 max-h-[75vh] p-6">
        <div class="w-full min-w-72 max-w-5xl flex-1 flex flex-col h-full min-h-0">
            <ScrollArea class="flex-1 w-full h-full min-h-0">
                <div ref="scrollContainer" class="mx-auto max-w-3xl space-y-6 p-6 pb-0">
                    <ChatMessage />
                    <div v-if="chatHistory.isLoading" class="flex gap-4 animate-fade-in flex-row">
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-chat-ai-border bg-chat-ai-bg text-chat-ai-fg">
                            <Icon icon="mdi:robot" class="h-5 w-5" />
                        </div>
                        <div
                            class="max-w-[75%] rounded-2xl px-4 py-3 border border-chat-ai-border bg-chat-ai-bg text-chat-ai-fg rounded-tl-sm">
                            <div class="flex items-center gap-1.5 py-1">
                                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot" />
                                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-1" />
                                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-2" />
                            </div>
                        </div>
                    </div>
                    <div v-if="chatHistory.apiSuccess === false && !chatHistory.isLoading" class="flex justify-end">
                        <div
                            class="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-500 border border-red-500/20">
                            <Icon icon="mdi:alert-circle" class="h-3 w-3" />
                            <span>Request Failed.</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import ChatMessage from "./ChatMessage.vue"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from "@iconify/vue"
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'

const chatHistory = useChatHistoryStore()
const scrollContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
}

watch(() => chatHistory.currentMessages, () => {
    nextTick(() => scrollToBottom())
}, { deep: true })

watch(() => chatHistory.isLoading, (isLoading) => {
    if (!isLoading) {
        nextTick(() => scrollToBottom())
    }
})
</script>
