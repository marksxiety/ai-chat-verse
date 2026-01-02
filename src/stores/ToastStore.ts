import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

export const useToastStore = defineStore('toastStore', () => {
    function success(title: string, description?: string) {
        toast.success(title, { description })
    }

    function error(title: string, description?: string) {
        toast.error(title, { description })
    }

    function info(title: string, description?: string) {
        toast.info(title, { description })
    }

    function warning(title: string, description?: string) {
        toast.warning(title, { description })
    }

    return { success, error, info, warning }
})
