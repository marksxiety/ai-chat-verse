import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useModelProviderStore = defineStore('modelProvider', () => {
    const provider = ref<string>('')
    const model = ref<string>('')

    const getProvider = computed(() => provider.value)
    const setProvider = (value: string) => {
        provider.value = value
    }

    const getModel = computed(() => model.value)
    const setModel = (value: string) => {
        model.value = value
    }

    return {
        getProvider,
        setProvider,
        getModel,
        setModel
    }
})