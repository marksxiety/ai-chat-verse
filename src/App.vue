<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>
      <main class="flex-1 h-full">
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
</script>