<template>
    <div :class="['flex gap-4 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row']">
        <!-- Avatar -->
        <div :class="[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            isUser
                ? 'bg-chat-user-bg text-chat-user-fg'
                : 'border border-chat-ai-border bg-chat-ai-bg text-chat-ai-fg'
        ]">
            <Icon :icon="isUser ? 'mdi:account' : 'mdi:robot'" class="h-5 w-5" />
        </div>

        <!-- Message Bubble -->
        <div :class="[
            'max-w-[75%] rounded-2xl px-4 py-3',
            isUser
                ? 'bg-chat-user-bg text-chat-user-fg rounded-tr-sm'
                : 'border border-chat-ai-border bg-chat-ai-bg text-chat-ai-fg rounded-tl-sm'
        ]">
            <div v-if="isLoading" class="flex items-center gap-1.5 py-1">
                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot" />
                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-1" />
                <span class="h-2 w-2 rounded-full bg-current animate-pulse-dot-delay-2" />
            </div>
            <p v-else class="text-sm leading-relaxed whitespace-pre-wrap">{{ content }}</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"

// Props
const props = defineProps({
    role: { type: String, required: true }, // "user" or "assistant"
    content: { type: String, required: true },
    isLoading: { type: Boolean, default: false }
})

const isUser = props.role === "user"
</script>
