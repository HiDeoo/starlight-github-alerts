import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { CONTINUE, SKIP, visit } from 'unist-util-visit'

import type { StarlightGitHubAlertsConfig } from './config'
import { getTypeMatch, isValidType } from './markdown'
import { shouldTransformPath } from './starlight'

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

      const { match, type } = getTypeMatch(firstGrandChild.value)

      if (!match || !isValidType(config, type)) return CONTINUE
      const asideType = config.types[type]

      firstGrandChild.value = firstGrandChild.value.slice(match[0].length).trimStart()

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

interface RemarkStarlightGitHubAlertsConfig {
  config: StarlightGitHubAlertsConfig
  markdownProcessorPaths: string[]
}
