<template>
    <div class="flex-1 flex flex-col items-center h-full min-h-0 max-h-[80vh] p-6">
        <div class="w-full min-w-72 max-w-5xl flex-1 flex flex-col h-full min-h-0">
            <ScrollArea class="flex-1 w-full h-full min-h-0">
                <div v-if="messages.length === 0" class="flex flex-1 flex-col items-center justify-center h-full">
                    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                        <Icon icon="mdi:message-plus" class="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 class="mt-4 text-xl font-semibold text-foreground">Start a conversation</h2>
                    <p class="mt-2 max-w-md text-center text-sm text-muted-foreground">
                        Choose your AI provider and model from the sidebar, then type a message to begin chatting.
                    </p>
                </div>
                <div class="mx-auto max-w-3xl space-y-6 p-6 pb-0" v-else>
                    <ChatMessage v-for="message in messages" :key="message.id" :role="message.role"
                        :content="message.content" />
                    <ChatMessage v-if="isLoading" role="assistant" content="" :isLoading="true" />
                </div>
            </ScrollArea>
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue"
import ChatMessage from "./ChatMessage.vue"
import { ScrollArea } from '@/components/ui/scroll-area'

const props = defineProps({
    messages: {
        type: Array,
        default: () => [
            { id: 1, role: "user", content: "Hello! Can you explain what Vue.js is and why it's popular?" },
            { id: 2, role: "assistant", content: "Vue.js is a progressive JavaScript framework for building user interfaces. It's popular because it has a gentle learning curve, is component-based, has a great reactivity system, excellent documentation, and is flexible for both small and large applications. Would you like me to explain any of these points in more detail?" },
            { id: 3, role: "user", content: "That's interesting! Can you show me an example of a simple Vue component?" },
            { id: 4, role: "assistant", content: "Sure! A simple Vue component consists of three parts: template for HTML structure, script for logic, and style for CSS. In the template you use double curly braces to display data, you can handle events with the at symbol, and reactive data is managed using the ref function. The component updates automatically when data changes. This makes building interactive UIs very straightforward!" },
            { id: 5, role: "user", content: "What about the Composition API vs Options API?" },
            { id: 6, role: "assistant", content: "Great question! Vue offers two ways to write components. The Composition API is more flexible, has better TypeScript support, easier to share logic between components, less boilerplate code, and is recommended for new projects. The Options API is more familiar to developers from other frameworks, has clear separation of concerns between data, methods, computed properties, is still fully supported, and works well for simpler components. Both APIs can coexist in the same project, and you can choose whichever works best for each component!" },
            { id: 7, role: "user", content: "How does Vue handle state management in larger applications?" },
            { id: 8, role: "assistant", content: "For larger applications, Vue provides several state management solutions. Pinia is the recommended library and is now the official state management solution for Vue. It's simpler than previous solutions and has great TypeScript support. You can also use Provide/Inject for component-level state sharing without a full state management library. Composables are perfect for reusable logic and state. For simple component-specific data, you can just use local state with ref or reactive. The Composition API makes it easy to combine these approaches as needed!" },
            { id: 9, role: "user", content: "What are some best practices for Vue performance optimization?" },
            { id: 10, role: "assistant", content: "Here are key Vue performance optimization techniques. Use computed properties for expensive calculations as they cache results. Choose between v-if and v-show based on how frequently the content changes. Always provide unique keys when rendering lists for efficient DOM updates. Load components only when needed with lazy loading. For very long lists, use virtual scrolling. Debounce input handlers and API calls to prevent excessive operations. Memoize expensive function calls. Optimize re-renders by extracting stable components. Split your app into lazy-loaded chunks for better initial load times. Consider server-side rendering with Nuxt for better SEO and performance. Remember to profile your app before optimizing to focus on actual bottlenecks!" }
        ]
    },
    isLoading: { type: Boolean, default: false }
})
</script>
