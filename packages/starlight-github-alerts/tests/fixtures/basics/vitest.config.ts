import { fileURLToPath } from 'node:url'

import { getViteConfig } from 'astro/config'

export default getViteConfig(
  {
    test: { name: 'basics' },
  },
  {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
)
