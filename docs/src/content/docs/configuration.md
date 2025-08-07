---
title: Configuration
description: An overview of all the configuration options supported by the Starlight GitHub Alerts plugin.
tableOfContents:
  maxHeadingLevel: 4
---

The Starlight GitHub Alerts plugin can be configured inside the `astro.config.mjs` configuration file of your project:

```js {12}
// astro.config.mjs
// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightGitHubAlerts from 'starlight-github-alerts'

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightGitHubAlerts({
          // Configuration options go here.
        }),
      ],
      title: 'My Docs',
    }),
  ],
})
```

## Plugin configuration

The Starlight GitHub Alerts plugin accepts the following configuration options:

### `types`

Defines the mapping used to convert [GitHub alert types](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts) to [Starlight aside types](https://starlight.astro.build/components/asides/#type).

#### `caution`

**Type:** `'caution' | 'danger' | 'note' | 'tip'`  
**Default:** `'danger'`

Sets the Starlight aside type used to render GitHub note alerts.

#### `important`

**Type:** `'caution' | 'danger' | 'note' | 'tip'`  
**Default:** `'caution'`

Sets the Starlight aside type used to render GitHub important alerts.

#### `note`

**Type:** `'caution' | 'danger' | 'note' | 'tip'`  
**Default:** `'note'`

Sets the Starlight aside type used to render GitHub note alerts.

#### `tip`

**Type:** `'caution' | 'danger' | 'note' | 'tip'`  
**Default:** `'tip'`

Sets the Starlight aside type used to render GitHub tip alerts.

#### `warning`

**Type:** `'caution' | 'danger' | 'note' | 'tip'`  
**Default:** `'caution'`

Sets the Starlight aside type used to render GitHub warning alerts.
