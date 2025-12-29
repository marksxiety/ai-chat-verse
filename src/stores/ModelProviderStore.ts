import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useModelProviderStore = defineStore('modelProvider', () => {
    const providerValue = ref<string | undefined>('')
    const providerLabel = ref<string | undefined>('')
    const modelValue = ref<string | undefined>('')
    const modelLabel = ref<string | undefined>('')

    const getProviderValue = computed(() => providerValue.value)
    const getProviderLabel = computed(() => providerLabel.value)
    const setProvider = (value: string | undefined, label: string | undefined) => {
        providerValue.value = value
        providerLabel.value = label
    }

    const getModelValue = computed(() => modelValue.value)
    const getModelLabel = computed(() => modelLabel.value)
    const setModel = (value: string | undefined, label: string | undefined) => {
        modelValue.value = value
        modelLabel.value = label
    }

    return {
        getProviderValue,
        getProviderLabel,
        setProvider,
        getModelValue,
        getModelLabel,
        setModel
    }
})