
export type Provider = string

export interface ModelOption {
    value: string
    label: string
}

export interface ProviderInfo {
    label: string
    icon: string
    models: ModelOption[]
}

export type ProviderModels = Record<Provider, ProviderInfo>