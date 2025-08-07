import { z } from 'astro/zod'

const starlightAsideTypeSchema = z.union([
  z.literal('caution'),
  z.literal('danger'),
  z.literal('note'),
  z.literal('tip'),
])

export const StarlightGitHubAlertsConfigSchema = z
  .object({
    /** Defines the mapping used to convert GitHub alert types to Starlight aside types. */
    types: z
      .object({
        /**
         * Sets the Starlight aside type used to render GitHub note alerts.
         *
         * @default 'danger'
         */
        caution: starlightAsideTypeSchema.default('danger'),
        /**
         * Sets the Starlight aside type used to render GitHub important alerts.
         *
         * @default 'caution'
         */
        important: starlightAsideTypeSchema.default('caution'),
        /**
         * Sets the Starlight aside type used to render GitHub note alerts.
         *
         * @default 'note'
         */
        note: starlightAsideTypeSchema.default('note'),
        /**
         * Sets the Starlight aside type used to render GitHub tip alerts.
         *
         * @default 'tip'
         */
        tip: starlightAsideTypeSchema.default('tip'),
        /**
         * Sets the Starlight aside type used to render GitHub warning alerts.
         *
         * @default 'caution'
         */
        warning: starlightAsideTypeSchema.default('caution'),
      })
      .default({}),
  })
  .default({})

export type StarlightGitHubAlertsUserConfig = z.input<typeof StarlightGitHubAlertsConfigSchema>
export type StarlightGitHubAlertsConfig = z.output<typeof StarlightGitHubAlertsConfigSchema>
