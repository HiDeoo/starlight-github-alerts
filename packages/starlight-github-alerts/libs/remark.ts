import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { CONTINUE, SKIP, visit } from 'unist-util-visit'

import type { StarlightGitHubAlertsConfig } from './config'
import { shouldTransformPath } from './starlight'

const alertRegex = /^(?<line>\[!(?<type>\w+)][\r\n]*)/

export const remarkStarlightGitHubAlerts: Plugin<[RemarkStarlightGitHubAlertsConfig], Root> = function ({
  config,
  markdownProcessorPaths,
}) {
  return (tree, file) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || index === undefined) return CONTINUE
      if (!shouldTransformPath(file.path, markdownProcessorPaths)) return false

      const [firstChild] = node.children
      if (firstChild?.type !== 'paragraph') return CONTINUE

      const [firstGrandChild] = firstChild.children
      if (firstGrandChild?.type !== 'text') return CONTINUE

      const match = alertRegex.exec(firstGrandChild.value)
      const { type } = match?.groups ?? {}

      const normalizedType = type?.toLowerCase()
      if (!isValidType(config, normalizedType)) return CONTINUE
      const asideType = config.types[normalizedType]

      firstGrandChild.value = firstGrandChild.value.slice(match?.[0].length).trimStart()

      parent.children.splice(index, 1, {
        type: 'containerDirective',
        name: asideType,
        children: node.children,
      })

      // Nested asides are not supported by GitHub.
      return SKIP
    })
  }
}

function isValidType(
  config: StarlightGitHubAlertsConfig,
  type: string | undefined,
): type is keyof StarlightGitHubAlertsConfig['types'] {
  return type !== undefined && type.toLowerCase() in config.types
}

interface RemarkStarlightGitHubAlertsConfig {
  config: StarlightGitHubAlertsConfig
  markdownProcessorPaths: string[]
}
