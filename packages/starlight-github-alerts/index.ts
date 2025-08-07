import type { StarlightPlugin } from '@astrojs/starlight/types'

export default function starlightGitHubAlerts(): StarlightPlugin {
  return {
    name: 'starlight-github-alerts',
    hooks: {
      'config:setup': ({ logger }) => {
        logger.info('starlight-github-alerts')
      },
    },
  }
}
