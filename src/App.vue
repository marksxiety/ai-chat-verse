<template>
  <Toaster position="top-right" />
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <header class="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger />
          <span class="text-sm font-semibold">{{ currentTitle }}</span>
        </div>
        <ModeToggle />
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
import { useChatHistoryStore } from '@/stores/ChatHistoryStore'
import { computed } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import ModeToggle from '@/components/ModeToggle.vue'

const chatHistory = useChatHistoryStore()

const currentTitle = computed(() => {
  return chatHistory.currentChat?.title ?? 'New Converstation'
})
</script>