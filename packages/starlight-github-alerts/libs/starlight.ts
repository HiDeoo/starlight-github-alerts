import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StarlightUserConfig } from '@astrojs/starlight/types'
import type { AstroConfig } from 'astro'

export function getMarkdownProcessorPaths(starlightConfig: StarlightUserConfig, astroConfig: AstroConfig): string[] {
  const paths = [normalizePath(fileURLToPath(new URL('content/docs/', astroConfig.srcDir)))]

  for (const processedDir of starlightConfig.markdown?.processedDirs ?? []) {
    paths.push(normalizePath(path.resolve(fileURLToPath(astroConfig.root), processedDir)))
  }

  return paths
}

export function shouldTransformPath(path: string | URL | undefined, markdownProcessorPaths: string[]) {
  // If the content does not have a path, e.g. when rendered using the content loader `renderMarkdown()` API, skip
  // the file.
  if (!path) return false
  const filePath = normalizePath(path instanceof URL ? fileURLToPath(path) : path)
  // If the document is not part of the Starlight docs collection, or any of the user-defined processed directories,
  // skip it.
  return markdownProcessorPaths.some(
    (markdownProcessorPath) => filePath === markdownProcessorPath || filePath.startsWith(markdownProcessorPath),
  )
}

/**
 * File path separators seems to be inconsistent on Windows between remark/rehype plugins used on Markdown vs MDX files.
 */
const backSlashRegex = /\\/g
function normalizePath(path: string) {
  return ensureTrailingSlash(path.replaceAll(backSlashRegex, '/'))
}

function ensureTrailingSlash(path: string): string {
  if (path.endsWith('/')) return path
  return `${path}/`
}
