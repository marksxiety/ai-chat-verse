<template>
    <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
        <DialogContent class="sm:max-w-145 p-2">
            <div class="flex flex-col max-h-[80vh]">
                <DialogHeader class="px-6 pt-6 pb-2 space-y-3">
                    <DialogTitle class="text-xl font-semibold">Prompt Templates</DialogTitle>
                    <DialogDescription class="text-sm leading-relaxed">
                        <span class="text-foreground">Select a template to use for your prompt.</span>
                        <span class="text-muted-foreground block mt-1">This will override your current input.</span>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea class="max-h-100 px-6">
                    <div class="space-y-6 pb-6">
                        <div v-for="group in templatesByCategory" :key="group.category">
                            <h3
                                class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                                <span class="w-6 h-px bg-border"></span>
                                {{ group.category }}
                            </h3>

                            <div class="grid gap-2">
                                <button v-for="template in group.templates" :key="template.id"
                                    @click="selectTemplate(template)"
                                    class="group relative flex items-start gap-3 w-full p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/50 hover:border-accent transition-all duration-200 text-left">
                                    <div
                                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                                        <Icon :icon="template.icon" class="h-5 w-5" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-sm text-foreground mb-1">
                                            {{ template.title }}
                                        </div>
                                        <div class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                            {{ template.description }}
                                        </div>
                                    </div>
                                    <Icon icon="lucide:chevron-right"
                                        class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Icon } from "@iconify/vue"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area'
import { DialogDescription } from 'reka-ui'

interface PromptTemplate {
    id: string;
    title: string;
    description: string;
    prompt: string;
    icon: string;
    category: string;
}

const props = defineProps({
    open: {
        default: false
    }
})

const emit = defineEmits(['update:open', 'select-template'])

const templates: PromptTemplate[] = [
    {
        id: "1",
        title: "Explain Code",
        description: "Get a detailed explanation of code",
        prompt: "Explain this code step by step:\n\n```\n[paste your code here]\n```",
        icon: "lucide:code",
        category: "Development",
    },
    {
        id: "2",
        title: "Debug Helper",
        description: "Help debug and fix issues",
        prompt: "I'm getting this error:\n\n[paste error]\n\nIn this code:\n\n```\n[paste code]\n```\n\nHelp me fix it.",
        icon: "lucide:bug",
        category: "Development",
    },
    {
        id: "3",
        title: "Write Documentation",
        description: "Generate documentation for code",
        prompt: "Write comprehensive documentation for this code, including:\n- Purpose\n- Parameters\n- Return values\n- Examples\n\n```\n[paste code]\n```",
        icon: "lucide:file-text",
        category: "Development",
    },
    {
        id: "4",
        title: "Brainstorm Ideas",
        description: "Generate creative ideas",
        prompt: "I need creative ideas for [topic]. Please provide:\n- 5 unique concepts\n- Pros and cons for each\n- Implementation suggestions",
        icon: "lucide:lightbulb",
        category: "Creative",
    },
    {
        id: "5",
        title: "Improve Writing",
        description: "Enhance text quality and clarity",
        prompt: "Please improve this text for clarity, grammar, and style while maintaining the original meaning:\n\n[paste text]",
        icon: "lucide:pen-line",
        category: "Writing",
    },
    {
        id: "6",
        title: "Translate Text",
        description: "Translate to another language",
        prompt: "Translate the following text to [target language]:\n\n[paste text]",
        icon: "lucide:languages",
        category: "Writing",
    },
    {
        id: "7",
        title: "Code Review",
        description: "Get feedback on your code",
        prompt: "Review this code for:\n- Best practices\n- Performance issues\n- Security concerns\n- Suggestions for improvement\n\n```\n[paste code]\n```",
        icon: "lucide:check-circle",
        category: "Development",
    },
    {
        id: "8",
        title: "Summarize Content",
        description: "Get a concise summary",
        prompt: "Summarize the following content in bullet points, highlighting key takeaways:\n\n[paste content]",
        icon: "lucide:sparkles",
        category: "Writing",
    },
]

const categories: string[] = [...new Set(templates.map(temp => temp.category))]

const templatesByCategory = computed(() => {
    return categories.map(category => ({
        category,
        templates: templates.filter(t => t.category === category),
    }))
})

function selectTemplate(template: PromptTemplate) {
    emit('select-template', template.prompt)
    emit('update:open', false)
}
</script>