import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGitHubAlerts from 'starlight-github-alerts'

const site =
  (process.env['CONTEXT'] === 'production' ? process.env['URL'] : process.env['DEPLOY_PRIME_URL']) ??
  'https://starlight-github-alerts.netlify.app/'

export default defineConfig({
  integrations: [
    starlight({
      description: 'Starlight plugin to render GitHub alerts as Starlight asides.',
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-github-alerts/edit/main/docs/',
      },
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: new URL('og.jpg', site).href },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:alt', content: 'Starlight plugin to render GitHub alerts as Starlight asides.' },
        },
      ],
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
  site,
  trailingSlash: 'always',
})
