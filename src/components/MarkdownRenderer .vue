<template>
    <div v-html="renderedMarkdown" class="text-foreground prose prose-sm max-w-none"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`
            } catch (__) { }
        }
        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})

const props = defineProps<{
    content: string
}>()

const renderedMarkdown = computed(() => {
    return md.render(props.content)
})
</script>

<style scoped>
:deep(h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}

:deep(h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
}

:deep(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

:deep(p) {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

:deep(ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

:deep(ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}

:deep(code) {
    background-color: var(--muted);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
}

:deep(pre) {
    background-color: var(--muted);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

:deep(pre code) {
    background-color: transparent;
    padding: 0;
    color: #0c0c0c;
}

:deep(a) {
    color: var(--primary);
    text-decoration: underline;
}

:deep(a:hover) {
    text-decoration: underline;
}

:deep(blockquote) {
    border-left: 4px solid var(--muted-foreground);
    padding-left: 1rem;
    font-style: italic;
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>