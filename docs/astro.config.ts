import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGitHubAlerts from 'starlight-github-alerts'

// TODO(HiDeoo) favicon
// TODO(HiDeoo) READMEs

export default defineConfig({
  integrations: [
    starlight({
      description: '// TODO(HiDeoo) ',
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-github-alerts/edit/main/docs/',
      },
      plugins: [starlightGitHubAlerts()],
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
      title: '// TODO(HiDeoo) ',
    }),
  ],
  site: 'https://starlight-github-alerts.netlify.app/',
  trailingSlash: 'always',
})
