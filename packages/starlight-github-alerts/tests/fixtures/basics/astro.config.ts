import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

import starlightGitHubAlerts from '../../../index'

export default defineConfig({
  integrations: [starlight({ title: 'Basics', plugins: [starlightGitHubAlerts()] })],
})
