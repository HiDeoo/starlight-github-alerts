import type { StarlightPlugin } from '@astrojs/starlight/types'
import { AstroError } from 'astro/errors'

import { isUnifiedProcessor } from './libs/astro'
import { StarlightGitHubAlertsConfigSchema, type StarlightGitHubAlertsUserConfig } from './libs/config'
import { remarkStarlightGitHubAlerts } from './libs/remark'
import { getMarkdownProcessorPaths } from './libs/starlight'

export default function starlightGitHubAlerts(userConfig?: StarlightGitHubAlertsUserConfig): StarlightPlugin {
  const parsedConfig = StarlightGitHubAlertsConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throwPluginError(
      `The provided plugin configuration is invalid.\n${parsedConfig.error.issues.map((issue) => issue.message).join('\n')}`,
    )
  }

  return {
    name: 'starlight-github-alerts',
    hooks: {
      'config:setup': ({ addIntegration, config: starlightConfig }) => {
        addIntegration({
          name: 'starlight-github-alerts-integration',
          hooks: {
            'astro:config:setup': ({ command, config: astroConfig }) => {
              if (command !== 'dev' && command !== 'build') return

              const markdownProcessor = astroConfig.markdown.processor

              if (!isUnifiedProcessor(markdownProcessor)) {
                // When not using the Unified processor, we throw an error, since we don't support Sätteri yet.
                throwPluginError(
                  "The configured 'markdown.processor' is not supported. Switch to 'unified()' from '@astrojs/markdown-remark'.",
                )
              }

              const remarkDirectiveIndex = markdownProcessor.options.remarkPlugins.findIndex(
                (plugin) => typeof plugin === 'function' && plugin.name === 'remarkDirective',
              )

              if (remarkDirectiveIndex === -1) return

              // Inject the remark plugin before the `remarkDirective` plugin.
              markdownProcessor.options.remarkPlugins.splice(remarkDirectiveIndex, 0, [
                remarkStarlightGitHubAlerts,
                {
                  config: parsedConfig.data,
                  markdownProcessorPaths: getMarkdownProcessorPaths(starlightConfig, astroConfig),
                },
              ])
            },
          },
        })
      },
    },
  }
}

function throwPluginError(message: string): never {
  throw new AstroError(
    message,
    `See the error report above for more information.\n\nIf you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-github-alerts/issues/new/choose`,
  )
}
