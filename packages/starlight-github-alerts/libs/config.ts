import { z } from 'astro/zod'

const starlightAsideTypeSchema = z.union([
  z.literal('note'),
  z.literal('tip'),
  z.literal('caution'),
  z.literal('danger'),
])

export const StarlightGitHubAlertsConfigSchema = z
  .object({
    // TODO(HiDeoo)
    types: z
      .object({
        // TODO(HiDeoo)
        caution: starlightAsideTypeSchema.default('danger'),
        // TODO(HiDeoo)
        important: starlightAsideTypeSchema.default('caution'),
        // TODO(HiDeoo)
        note: starlightAsideTypeSchema.default('note'),
        // TODO(HiDeoo)
        tip: starlightAsideTypeSchema.default('tip'),
        // TODO(HiDeoo)
        warning: starlightAsideTypeSchema.default('caution'),
      })
      .default({}),
  })
  .default({})

export type StarlightGitHubAlertsUserConfig = z.input<typeof StarlightGitHubAlertsConfigSchema>
export type StarlightGitHubAlertsConfig = z.output<typeof StarlightGitHubAlertsConfigSchema>
