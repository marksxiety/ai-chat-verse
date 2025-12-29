
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