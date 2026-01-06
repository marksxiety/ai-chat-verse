<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="outline">
                <Icon :icon="selectedTheme(mode)" class="h-[1.2rem] w-[1.2rem]" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem @click="mode = 'light'" class="flex gap-2" :class="{ 'bg-accent': mode === 'light' }">
                <Icon icon="radix-icons:sun" />
                Light
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'dark'" class="flex gap-2" :class="{ 'bg-accent': mode === 'dark' }">
                <Icon icon="radix-icons:moon" />
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem @click="mode = 'auto'" class="flex gap-2" :class="{ 'bg-accent': mode === 'auto' }">
                <Icon icon="material-symbols-light:computer-outline" />
                System
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

function selectedTheme(theme: string) {
    if (theme === 'light') {
        return 'radix-icons:sun'
    } else if (theme === 'dark') {
        return 'radix-icons:moon'
    } else {
        return 'material-symbols-light:computer-outline'
    }
}

const mode = useColorMode()
</script>