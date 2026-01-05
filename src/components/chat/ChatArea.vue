<template>
    <div class="flex-1 flex flex-col items-center h-full min-h-0 p-6">
        <div class="w-full min-w-72 max-w-5xl flex-1 flex flex-col h-full min-h-0">
            <ScrollArea class="flex-1 w-full h-full min-h-0">
                <div ref="scrollContainer" class="mx-auto max-w-3xl space-y-6 p-6 pb-4">
                    <ChatMessage />
                    <div v-if="chatHistory.apiSuccess === false && !chatHistory.isLoading" class="flex justify-end">
                        <div
                            class="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-destructive/10 text-destructive border border-destructive/20">
                            <Icon icon="mdi:alert-circle" class="h-3 w-3" />
                            <span>Something went wrong. Please try again.</span>
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
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'
import { useToastStore } from '@/stores/ToastStore'

const chatHistory = useChatHistoryStore()
const Toast = useToastStore()
const scrollContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
    if (scrollContainer.value) {
        const viewport = scrollContainer.value.closest('[data-slot="scroll-area-viewport"]')
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight
        }
    }
}

watch(() => chatHistory.currentMessages, () => {
    nextTick(() => scrollToBottom())
}, { deep: true })

watch(() => chatHistory.isLoading, () => {
    nextTick(() => {
        scrollToBottom()
        setTimeout(() => scrollToBottom(), 100)
    })
})

watch(() => (chatHistory.apiSuccess), (apiSuccess) => {
    if (apiSuccess === false) {
        Toast.error('Error', 'Something went wrong')
    }
})
</script>
