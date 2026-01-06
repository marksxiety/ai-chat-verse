<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent class="sm:max-w-lg p-4">
            <DialogHeader class="px-6 pt-6 pb-2 space-y-2">
                <DialogTitle class="text-2xl font-bold flex items-center gap-3">
                    <div class="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        <Icon icon="lucide:bot" class="h-5 w-5 text-primary" />
                    </div>
                    AI Chat Verse
                </DialogTitle>
                <DialogDescription class="text-base font-medium">
                    v.1.0.2
                </DialogDescription>
            </DialogHeader>

            <ScrollArea class="max-h-[60vh] p-4">
                <div class="space-y-6 py-4">
                    <section>
                        <h3 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Icon icon="lucide:info" class="h-4 w-4" />
                            Overview
                        </h3>
                        <p class="text-sm text-muted-foreground leading-relaxed">
                            A modern multi-LLM chat interface that lets you switch between AI providers and models in one unified chat experience.
                        </p>
                    </section>

                    <Separator />

                    <section>
                        <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Icon icon="lucide:zap" class="h-4 w-4" />
                            Features
                        </h3>
                        <ul class="text-sm text-muted-foreground space-y-2">
                            <li class="flex items-start gap-2">
                                <Icon icon="lucide:check-circle-2" class="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>Unified chat experience across multiple AI providers</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <Icon icon="lucide:check-circle-2" class="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>Provider and model switching</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <Icon icon="lucide:check-circle-2" class="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>Session-based chat history</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <Icon icon="lucide:check-circle-2" class="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>Chat completions–focused design</span>
                            </li>
                        </ul>
                    </section>

                    <Separator />

                    <section>
                        <h3 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Icon icon="lucide:cpu" class="h-4 w-4" />
                            Supported Providers
                        </h3>
                        <div class="grid grid-cols-1 gap-2">
                            <div class="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div class="flex items-center gap-2">
                                    <Icon icon="simple-icons:openai" class="h-4 w-4" />
                                    <span class="text-sm font-medium">OpenAI</span>
                                </div>
                                <span class="text-xs text-muted-foreground">4 models</span>
                            </div>
                            <div class="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div class="flex items-center gap-2">
                                    <Icon icon="mynaui:letter-z-square" class="h-4 w-4" />
                                    <span class="text-sm font-medium">Z.AI</span>
                                </div>
                                <span class="text-xs text-muted-foreground">2 models</span>
                            </div>
                            <div class="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div class="flex items-center gap-2">
                                    <Icon icon="hugeicons:deepseek" class="h-4 w-4" />
                                    <span class="text-sm font-medium">DeepSeek</span>
                                </div>
                                <span class="text-xs text-muted-foreground">2 models</span>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section>
                        <h3 class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Icon icon="lucide:terminal" class="h-4 w-4" />
                            Quick Start
                        </h3>
                        <div class="text-sm text-muted-foreground space-y-1">
                            <p>1. Add API keys to <code class="px-1 py-0.5 bg-muted rounded text-xs">.env</code></p>
                            <p>2. Select provider & model from sidebar</p>
                            <p>3. Start chatting!</p>
                        </div>
                    </section>
                </div>
            </ScrollArea>

            <DialogFooter class="px-6 py-4 border-t">
                <Button @click="emit('update:open', false)">Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogDescription } from 'reka-ui'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Icon } from '@iconify/vue'

const props = defineProps({
    open: {
        default: false
    }
})

const emit = defineEmits(['update:open'])
</script>