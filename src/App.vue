<script setup lang="ts">
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
      </header>

      <main class="flex-1 p-6">
        <h1 class="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p class="mt-4 text-muted-foreground">
          Your content goes here...
        </p>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>