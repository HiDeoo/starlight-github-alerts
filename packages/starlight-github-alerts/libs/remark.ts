import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { CONTINUE, SKIP, visit } from 'unist-util-visit'

import type { StarlightGitHubAlertsConfig } from './config'

const alertRegex = /^(?<line>\[!(?<type>\w+)][\r\n]*)/

export const remarkStarlightGitHubAlerts: Plugin<[RemarkStarlightGitHubAlertsConfig], Root> = function ({
  config,
  docsCollectionPath,
}) {
  const normalizedDocsCollectionPath = normalizePath(docsCollectionPath)

  return (tree, file) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || index === undefined) return CONTINUE

      // If the content does not have a path, e.g. when rendered using the content loader `renderMarkdown()` API, skip
      // the file.
      if (!file.path) return false
      // If the document is not part of the Starlight docs collection, skip it.
      if (!normalizePath(file.path).startsWith(normalizedDocsCollectionPath)) return CONTINUE

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

/**
 * File path separators seems to be inconsistent on Windows between remark/rehype plugins used on Markdown vs MDX files.
 */
const backSlashRegex = /\\/g
function normalizePath(path: string) {
  return path.replaceAll(backSlashRegex, '/')
}

interface RemarkStarlightGitHubAlertsConfig {
  config: StarlightGitHubAlertsConfig
  docsCollectionPath: string
}
