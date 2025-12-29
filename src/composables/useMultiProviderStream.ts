import OpenAI from "openai";
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
        const openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true,
        });
        try {
            const result = await openai.chat.completions.create({
                model: modelProvider.getModelValue || "gpt-4o-mini",
                messages,
                stream: true,
            });

            for await (const chunk of result) {
                const delta = chunk.choices?.[0]?.delta?.content;
                if (delta) {
                    streamedContent.value += delta
                    onChunk(delta);
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
        const client = new OpenAI({
            apiKey: import.meta.env.VITE_ZHIPU_API_KEY,
            baseURL: 'https://api.z.ai/api/coding/paas/v4',
            dangerouslyAllowBrowser: true,
        });

        // Create an instruction to force English 
        // since GLM is developed by Zhipu AI (a Chinese company), its default "personality"
        // and system-level greetings are set to Chinese
        const systemInstruction = {
            role: "system",
            content: "You are a helpful coding assistant. You must respond strictly in English unless the user specifically asks you to speak in another language."
        };

        const finalMessages = [systemInstruction, ...messages];

        try {
            const result = await client.chat.completions.create({
                model: modelProvider.getModelValue || 'GLM-4.7',
                messages: finalMessages, // Use the updated array
                stream: true,
            });

            for await (const chunk of result) {
                const delta = chunk.choices?.[0]?.delta?.content;
                if (delta) {
                    streamedContent.value += delta;
                    onChunk(delta);
                }
            }

            return { success: true };
        } catch (error) {
            return { success: false, data: error };
        }
    }

    return {
        isStreaming,
        streamedContent,
        streamMessage
    }
}