<template>
    <div class="bg-background p-4">
        <div class="mx-auto max-w-3xl">
            <div class="mb-2 flex items-center justify-center">
                <Badge variant="secondary" class="text-xs font-normal">
                    {{ provider }} · {{ model }}
                </Badge>
            </div>
            <div
                class="relative flex items-end gap-2 rounded-xl border border-input bg-card p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring">
                <textarea v-model="input" ref="textareaRef" placeholder="Type your message..." @keydown="handleKeyDown"
                    class="min-h-11 max-h-50 flex-1 resize-none border-0 bg-transparent p-2 text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows="1">
                </textarea>

                <button @click="handleSubmit" :disabled="!input.trim() || isLoading"
                    class="h-10 w-10 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center">
                    <Icon icon="streamline:mail-send-email-message-solid" class="h-4 w-4" />
                </button>
            </div>
            <p class="mt-2 text-center text-xs text-muted-foreground">
                Press Enter to send, Shift+Enter for new line
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue"
import { Icon } from "@iconify/vue"
import { useModelProviderStore } from '@/stores/ModelProviderStore'
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'
import { Badge } from '@/components/ui/badge'

const modelProvider = useModelProviderStore()
const chatHistory = useChatHistoryStore()

const provider = computed(() => modelProvider.getProviderLabel)
const model = computed(() => modelProvider.getModelLabel)
const isLoading = computed(() => chatHistory.isLoading)

const input = ref("")
const textareaRef = ref<HTMLTextAreaElement | null>(null)

watch(input, async () => {
    await nextTick()
    const textarea = textareaRef.value
    if (textarea) {
        textarea.style.height = "auto"
        const newHeight = Math.max(44, Math.min(textarea.scrollHeight, 200))
        textarea.style.height = `${newHeight}px`
    }
})

function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
    }
}

async function handleSubmit() {
    if (!input.value.trim() || isLoading.value) return
    const message = input.value
    input.value = ""
    await chatHistory.sendMessage(message)
}
</script>