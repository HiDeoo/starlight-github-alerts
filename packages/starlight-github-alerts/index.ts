import type { StarlightPlugin } from '@astrojs/starlight/types'

import { StarlightGitHubAlertsConfigSchema, type StarlightGitHubAlertsUserConfig } from './libs/config'
import { throwPluginError } from './libs/error'
import { applyMarkdownPlugin } from './libs/processor'
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

              applyMarkdownPlugin(
                astroConfig.markdown.processor,
                parsedConfig.data,
                getMarkdownProcessorPaths(starlightConfig, astroConfig),
              )
            },
          },
        })
      },
    },
  }
}
