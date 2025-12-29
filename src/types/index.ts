
export type Provider = string

export interface ModelOption {
    value: string
    label: string
}

export interface Chats {
    title: string,
    date: string
}

export type RecentChats = Chats[]

export type ProviderModels = Record<Provider, ModelOption[]>

export interface Message {
    id: number
    role: 'user' | 'assistant'
    content: string
}

export interface MessageProps {
    role: 'user' | 'assistant'
    content: string
    isLoading?: boolean
}

export interface ChatAreaProps {
    messages?: Message[]
    isLoading?: boolean
}
