
export type Provider = string

export interface ModelOption {
    value: string
    label: string
}

export type ProviderModels = Record<Provider, ModelOption[]>