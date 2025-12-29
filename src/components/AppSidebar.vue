<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const provider = ref('')
const model = ref('')

const recentChats = [
    { title: 'Chat about React', date: '2 hours ago' },
    { title: 'Python debugging', date: 'Yesterday' },
    { title: 'API design discussion', date: '3 days ago' },
]
</script>

<template>
    <Sidebar>
        <SidebarHeader class="p-6 border-b border-border/50">
            <div>
                <Icon icon="ri:chat-ai-line" class="text-3xl text-primary" />
                <span>AI CHAT VERSE</span>
            </div>
        </SidebarHeader>

        <SidebarContent class="px-4 py-6">
            <SidebarGroup>
                <div class="mb-6">
                    <Button
                        class="w-full h-12 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 bg-gradient-to-r from-primary to-primary/90">
                        <Icon icon="lucide:plus" class="mr-2 h-5 w-5" />
                        New Chat
                    </Button>
                </div>

                <div class="space-y-4 mb-6">
                    <div>
                        <label
                            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Provider</label>
                        <Select v-model="provider">
                            <SelectTrigger
                                class="h-11 w-full bg-muted/50 border-border/50 hover:bg-muted/70 transition-colors">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="gpt">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:openai-fill" class="h-4 w-4" />
                                            GPT
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="claude">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:anthropic-fill" class="h-4 w-4" />
                                            Claude
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="gemini">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ri:google-fill" class="h-4 w-4" />
                                            Gemini
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label
                            class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Model</label>
                        <Select v-model="model">
                            <SelectTrigger
                                class="h-11 w-full bg-muted/50 border-border/50 hover:bg-muted/70 transition-colors">
                                <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                                    <SelectItem value="claude-3">Claude 3</SelectItem>
                                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator class="my-6" />

                <SidebarGroupLabel
                    class="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Chats
                </SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem v-for="chat in recentChats" :key="chat.title">
                        <SidebarMenuButton as-child
                            class="h-11 px-3 rounded-lg hover:bg-muted/80 transition-all duration-200">
                            <a href="#" class="flex items-center gap-3">
                                <Icon icon="lucide:message-square" class="h-4 w-4 text-muted-foreground" />
                                <span class="flex-1 text-sm truncate text-left">{{ chat.title }}</span>
                                <span class="text-xs text-muted-foreground">{{ chat.date }}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter class="p-4 border-t border-border/50 bg-muted/20">
            <div class="text-xs text-muted-foreground flex items-center gap-2">
                <Icon icon="lucide:info" class="h-3 w-3" />
                <span>v1.0.0</span>
            </div>
        </SidebarFooter>
    </Sidebar>
</template>