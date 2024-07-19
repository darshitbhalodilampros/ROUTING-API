export enum ProviderName {
  RPC = 'RPC',
  UNKNOWN = 'UNKNOWN',
}

export function deriveProviderName(url: string): ProviderName {
  for (const name in ProviderName) {
    if (url.toUpperCase().includes(name)) {
      return ProviderName[name as keyof typeof ProviderName]
    }
  }

  return ProviderName.UNKNOWN
}
