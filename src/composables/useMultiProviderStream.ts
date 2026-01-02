import { ref } from 'vue'
import { useModelProviderStore } from '@/stores/ModelProviderStore'

export function useMultiProviderStream() {
    const modelProvider = useModelProviderStore()
    const isStreaming = ref(false)
    const streamedContent = ref('')

    async function streamMessage(messages: any[], onChunk: (chunk: string) => void) {
        isStreaming.value = true
        streamedContent.value = ''

        const provider = modelProvider.getProviderValue
        const model = modelProvider.getModelValue

        try {
            const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT || 3001}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider,
                    model,
                    messages
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
            }

            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            if (!reader) throw new Error('ReadableStream not supported or no reader found.')

            // Main streaming loop
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                // Split by double newlines to catch individual "data: " lines from the SSE stream
                const lines = chunk.split('\n').filter(line => line.trim())

                for (const line of lines) {
                    if (line === 'data: [DONE]') continue
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.slice(6))
                            if (json.content) {
                                streamedContent.value += json.content
                                onChunk(json.content)
                            }
                        } catch (e) {
                            continue
                        }
                    }
                }
            }

            return { success: true }
        } catch (error) {
            console.error("Streaming Error:", error)
            return {
                success: false,
                data: error instanceof Error ? error.message : "An unidentified error occurred",
            }
        } finally {
            isStreaming.value = false
        }
    }

    return {
        isStreaming,
        streamedContent,
        streamMessage
    }
}