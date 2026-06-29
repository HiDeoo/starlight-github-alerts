import type { AstroConfig } from 'astro'

import type { StarlightGitHubAlertsConfig } from './config'
import { throwPluginError } from './error'
import { remarkStarlightGitHubAlerts } from './remark'
import { satteriStarlightGithubAlerts } from './satteri'

export function applyMarkdownPlugin(
  processor: MarkdownProcessor,
  config: StarlightGitHubAlertsConfig,
  markdownProcessorPaths: string[],
) {
  if (isSatteriProcessor(processor)) {
    const starlightAsidesIndex = processor.options.mdastPlugins.findIndex(
      (plugin) =>
        typeof plugin === 'object' && plugin !== null && 'name' in plugin && plugin.name === 'starlight-asides',
    )

    if (starlightAsidesIndex === -1) return

    processor.options.mdastPlugins.splice(
      starlightAsidesIndex,
      0,
      satteriStarlightGithubAlerts(config, markdownProcessorPaths),
    )
  } else if (isUnifiedProcessor(processor)) {
    const remarkDirectiveIndex = processor.options.remarkPlugins.findIndex(
      (plugin) => typeof plugin === 'function' && plugin.name === 'remarkDirective',
    )

    if (remarkDirectiveIndex === -1) return

    // Inject the remark plugin before the `remarkDirective` plugin.
    processor.options.remarkPlugins.splice(remarkDirectiveIndex, 0, [
      remarkStarlightGitHubAlerts,
      { config, markdownProcessorPaths },
    ])
  } else {
    throwPluginError("The configured 'markdown.processor' is not supported by the starlight-github-alerts plugin.")
  }
}

function isSatteriProcessor(processor: unknown): processor is SatteriMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { mdastPlugins?: unknown } }
  return candidate.name === 'satteri' && Array.isArray(candidate.options?.mdastPlugins)
}

function isUnifiedProcessor(processor: unknown): processor is UnifiedMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { remarkPlugins?: unknown } }
  return candidate.name === 'unified' && Array.isArray(candidate.options?.remarkPlugins)
}

type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>

interface SatteriMarkdownProcessor {
  name: 'satteri'
  options: { mdastPlugins: unknown[] }
}

interface UnifiedMarkdownProcessor {
  name: 'unified'
  options: { remarkPlugins: unknown[] }
}
