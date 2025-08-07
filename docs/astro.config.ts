import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGitHubAlerts from 'starlight-github-alerts'

export default defineConfig({
  integrations: [
    starlight({
      description: 'Starlight plugin to render GitHub alerts as Starlight asides.',
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-github-alerts/edit/main/docs/',
      },
      plugins: [starlightGitHubAlerts()],
      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started', 'configuration'],
        },
        {
          label: 'Resources',
          items: [{ label: 'Plugins and Tools', slug: 'resources/starlight' }],
        },
        'demo',
      ],
      social: [
        {
          href: 'https://bsky.app/profile/hideoo.dev',
          icon: 'blueSky',
          label: 'Bluesky',
        },
        {
          href: 'https://github.com/HiDeoo/starlight-github-alerts',
          icon: 'github',
          label: 'GitHub',
        },
      ],
      title: 'Starlight GitHub Alerts',
    }),
  ],
  site: 'https://starlight-github-alerts.netlify.app/',
  trailingSlash: 'always',
})
