<template>
  <Toaster position="top-right" />
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <span class="text-sm font-semibold">{{ currentTitle }}</span>
      </header>
      <main class="flex-1 h-full flex flex-col min-h-0">
        <ChatArea />
        <ChatInput />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import ChatArea from '@/components/chat/ChatArea.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import { useChatHistoryStore } from './stores/ChatHistoryStore'
import { computed } from 'vue'
import { Toaster } from '@/components/ui/sonner'

const chatHistory = useChatHistoryStore()

const currentTitle = computed(() => {
  return chatHistory.currentChat?.title ?? 'New Converstation'
})
</script>