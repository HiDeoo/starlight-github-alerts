import { fileURLToPath } from 'node:url'

import type { StarlightPlugin } from '@astrojs/starlight/types'
import { AstroError } from 'astro/errors'

import { StarlightGitHubAlertsConfigSchema, type StarlightGitHubAlertsUserConfig } from './libs/config'
import { remarkStarlightGitHubAlerts } from './libs/remark'

export default function starlightGitHubAlerts(userConfig?: StarlightGitHubAlertsUserConfig): StarlightPlugin {
  const parsedConfig = StarlightGitHubAlertsConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throw new AstroError(
      `The provided plugin configuration is invalid.\n${parsedConfig.error.issues.map((issue) => issue.message).join('\n')}`,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-github-alerts/issues/new/choose`,
    )
  }

  return {
    name: 'starlight-github-alerts',
    hooks: {
      'config:setup': ({ addIntegration }) => {
        addIntegration({
          name: 'starlight-github-alerts-integration',
          hooks: {
            'astro:config:setup': ({ command, config }) => {
              if (command !== 'dev' && command !== 'build') return

              const remarkDirectiveIndex = config.markdown.remarkPlugins.findIndex(
                (plugin) => typeof plugin === 'function' && plugin.name === 'remarkDirective',
              )

              if (remarkDirectiveIndex === -1) return

              // Inject the remark plugin before the `remarkDirective` plugin.
              config.markdown.remarkPlugins.splice(remarkDirectiveIndex, 0, [
                remarkStarlightGitHubAlerts,
                {
                  config: parsedConfig.data,
                  docsCollectionPath: fileURLToPath(new URL('content/docs/', config.srcDir)),
                },
              ])
            },
          },
        })
      },
    },
  }
}
