import type { Parents } from 'mdast'
import { defineMdastPlugin, type MdastPluginDefinition } from 'satteri'

import type { StarlightGitHubAlertsConfig } from './config'
import { getTypeMatch, isValidType } from './markdown'
import { shouldTransformPath } from './starlight'

export function satteriStarlightGithubAlerts(
  config: StarlightGitHubAlertsConfig,
  markdownProcessorPaths: string[],
): MdastPluginDefinition {
  return defineMdastPlugin({
    name: 'starlight-github-alerts',
    blockquote(node, ctx) {
      if (!shouldTransformPath(ctx.fileURL, markdownProcessorPaths)) return

      const [firstChild] = node.children
      if (firstChild?.type !== 'paragraph') return

      const [firstGrandChild] = firstChild.children
      if (firstGrandChild?.type !== 'text') return

      const { match, type } = getTypeMatch(firstGrandChild.value)

      if (!match || !isValidType(config, type)) return
      const asideType = config.types[type]

      let parent: Parents | undefined = ctx.parent(node)
      while (parent) {
        if (parent.type === 'blockquote') {
          const [parentFirstChild] = parent.children

          if (parentFirstChild?.type === 'paragraph') {
            const [parentFirstGrandChild] = parentFirstChild.children

            if (parentFirstGrandChild?.type === 'text') {
              const { type: parentType } = getTypeMatch(parentFirstGrandChild.value)

              // Nested asides are not supported by GitHub.
              if (isValidType(config, parentType)) return
            }
          }
        }

        parent = ctx.parent(parent)
      }

      ctx.setProperty(firstGrandChild, 'value', firstGrandChild.value.slice(match[0].length).trimStart())

      ctx.replaceNode(node, {
        type: 'containerDirective',
        name: asideType,
        children: [...node.children],
      })
    },
  })
}
