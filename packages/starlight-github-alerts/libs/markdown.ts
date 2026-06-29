import type { StarlightGitHubAlertsConfig } from './config'

const alertRegex = /^(?<line>\[!(?<type>\w+)][\r\n]*)/

export function getTypeMatch(value: string) {
  const match = alertRegex.exec(value)
  const { type } = match?.groups ?? {}

  return { match, type: type?.toLowerCase() }
}

export function isValidType(
  config: StarlightGitHubAlertsConfig,
  type: string | undefined,
): type is keyof StarlightGitHubAlertsConfig['types'] {
  return type !== undefined && type.toLowerCase() in config.types
}
