import { ref } from 'vue'
import { useModelProviderStore } from '@/stores/ModelProviderStore'

export function useMultiProviderStream() {
    const modelProvider = useModelProviderStore()
    const isStreaming = ref(false)
    const streamedContent = ref('')
    const apiSuccess = ref(false)

    async function streamMessage(messages: any[], onChunk: (chunk: string) => void) {
        isStreaming.value = true
        streamedContent.value = ''

        const provider = modelProvider.getProviderValue

        switch (provider) {
            case 'openai':
                await streamOpenAI(messages, onChunk)
                break
            case 'zai':
                await streamZhipu(messages, onChunk)
        }

        isStreaming.value = false
    }

    async function streamOpenAI(messages: any[], onChunk: (chunk: string) => void) {
        apiSuccess.value = false
        try {
            const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT || 3001}/api/chat/openai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    model: modelProvider.getModelValue || 'gpt-4o-mini'
                })
            });

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line === 'data: [DONE]') continue;
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.slice(6));
                            if (json.content) {
                                streamedContent.value += json.content;
                                onChunk(json.content);
                            }
                        } catch (e) { }
                    }
                }
            }
            apiSuccess.value = true
            return { success: true };
        } catch (error) {
            apiSuccess.value = false
            return {
                success: false,
                data: error || "Unidentified Error Occured",
            };
        }
    }

    async function streamZhipu(messages: any[], onChunk: (chunk: string) => void) {
        apiSuccess.value = false
        try {
            const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT || 3001}/api/chat/zhipu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    model: modelProvider.getModelValue || 'GLM-4.7'
                })
            });

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No reader');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    if (line === 'data: [DONE]') continue;
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.slice(6));
                            if (json.content) {
                                streamedContent.value += json.content;
                                onChunk(json.content);
                            }
                        } catch (e) { }
                    }
                }
            }
            apiSuccess.value = true
            return { success: true };
        } catch (error) {
            apiSuccess.value = false
            return { success: false, data: error };
        }
    }

    return {
        isStreaming,
        streamedContent,
        apiSuccess,
        streamMessage
    }
}