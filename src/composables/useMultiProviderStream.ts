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
        let result

        switch (provider) {
            case 'openai':
                result = await streamOpenAI(messages, onChunk)
                break
            case 'zai':
                result = await streamZhipu(messages, onChunk)
                break
            case 'deepseek':
                result = await streamDeepSeek(messages, onChunk)
                break
        }

        isStreaming.value = false
        return result
    }

    async function streamOpenAI(messages: any[], onChunk: (chunk: string) => void) {
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
            return { success: true };
        } catch (error) {
            return {
                success: false,
                data: error || "Unidentified Error Occured",
            };
        }
    }

    async function streamZhipu(messages: any[], onChunk: (chunk: string) => void) {
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
            return { success: true };
        } catch (error) {
            return { success: false, data: error };
        }
    }

    async function streamDeepSeek(messages: any[], onChunk: (chunk: string) => void) {
        try {
            const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT || 3001}/api/chat/deepseek`, {
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
            return { success: true };
        } catch (error) {
            return {
                success: false,
                data: error || "Unidentified Error Occured",
            };
        }
    }

    return {
        isStreaming,
        streamedContent,
        streamMessage
    }
}