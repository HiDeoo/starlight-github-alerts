import { fileURLToPath } from 'node:url'

import type { Paragraph } from 'mdast'
import { defineMdastPlugin, markdownToHtml, type MdastPluginDefinition } from 'satteri'
import { expect, test } from 'vitest'

import { StarlightGitHubAlertsConfigSchema, type StarlightGitHubAlertsUserConfig } from '../libs/config'
import { satteriStarlightGithubAlerts } from '../libs/satteri'

const mdastPlugins = createMdastPlugins()

test('transforms alerts', async () => {
  const res = await renderMarkdown(`
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
`)

  expect(res).toMatchInlineSnapshot(`
    "<aside class="note"><p>Useful information that users should know, even when skimming content.</p></aside>
    <aside class="tip"><p>Helpful advice for doing things better or more easily.</p></aside>
    <aside class="caution"><p>Key information users need to know to achieve their goal.</p></aside>
    <aside class="caution"><p>Urgent info that needs immediate user attention to avoid problems.</p></aside>
    <aside class="danger"><p>Advises about risks or negative outcomes of certain actions.</p></aside>
    "
  `)
})

test('transforms an alert with custom type mapping', async () => {
  const res = await renderMarkdown(
    `
> [!NOTE]
> A note alert that is mapped to the danger type.
`,
    {
      config: { types: { note: 'danger' } },
    },
  )

  expect(res).toMatchInlineSnapshot(`
    "<aside class="danger"><p>A note alert that is mapped to the danger type.</p></aside>
    "
  `)
})

test('transforms complex alerts', async () => {
  const res = await renderMarkdown(
    `
## Complex Alert

> [!NOTE]
> This is a complex alert with multiple paragraphs.
>
> And even a nested blockquote:
>
> > Something that is quoted.
>
> And even some code:
>
> \`\`\`js
> console.log('Hello, world!');
> \`\`\`
`,
  )

  expect(res).toMatchInlineSnapshot(`
    "<h2>Complex Alert</h2>
    <aside class="note"><p>This is a complex alert with multiple paragraphs.</p><p>And even a nested blockquote:</p><blockquote>
    <p>Something that is quoted.</p>
    </blockquote><p>And even some code:</p><pre><code class="language-js">console.log('Hello, world!');
    </code></pre></aside>
    "
  `)
})

test('does not transform unknown alerts', async () => {
  const res = await renderMarkdown(`
> [!DANGER]
> An alert type that is not valid.
`)

  expect(res).toMatchInlineSnapshot(`
    "<blockquote>
    <p>[!DANGER]
    An alert type that is not valid.</p>
    </blockquote>
    "
  `)
})

test('does not transform nested alerts', async () => {
  const res = await renderMarkdown(`
> [!NOTE]
> Useful information that users should know, even when skimming content.
>
> > [!NOTE]
> > A nested alert that should not be transformed.
`)

  expect(res).toMatchInlineSnapshot(`
    "<aside class="note"><p>Useful information that users should know, even when skimming content.</p><blockquote>
    <p>[!NOTE]
    A nested alert that should not be transformed.</p>
    </blockquote></aside>
    "
  `)
})

test('transforms alerts for files in configured custom markdown processor paths', async () => {
  const res = await renderMarkdown(
    `
> [!NOTE]
> An alert in a configured custom markdown processor path.
`,
    {
      markdownProcessorPaths: [fileURLToPath(new URL('src/content/test/', import.meta.url))],
      url: new URL(`src/content/test/index.md`, import.meta.url),
    },
  )

  expect(res).toMatchInlineSnapshot(`
    "<aside class="note"><p>An alert in a configured custom markdown processor path.</p></aside>
    "
  `)
})

test('does not transform alerts for files outside of any configured markdown processor paths', async () => {
  const content = `
> [!NOTE]
> An alert outside of any configured markdown processor paths.
`

  const testcases = [
    { content, url: new URL(`src/content/test/index.md`, import.meta.url) },
    {
      content,
      markdownProcessorPaths: [fileURLToPath(new URL('src/content/test/', import.meta.url))],
      url: new URL(`src/content/testimonials/index.md`, import.meta.url),
    },
  ]

  for (const testCase of testcases) {
    const res = await renderMarkdown(
      testCase.content,
      testCase.markdownProcessorPaths
        ? { markdownProcessorPaths: testCase.markdownProcessorPaths, url: testCase.url }
        : { url: testCase.url },
    )

    expect(res).toMatch(/^<blockquote>\s?<p>\[!NOTE]/)
  }
})

async function renderMarkdown(
  content: string,
  options?: {
    config?: StarlightGitHubAlertsUserConfig
    markdownProcessorPaths?: string[]
    url?: URL | undefined
  },
) {
  const { html } = await markdownToHtml(content, {
    fileURL: options?.url ?? new URL(`src/content/docs/index.md`, import.meta.url),
    mdastPlugins: options?.config || options?.markdownProcessorPaths ? createMdastPlugins(options) : mdastPlugins,
  })

  return html
}

function createMdastPlugins(options?: Parameters<typeof renderMarkdown>[1]): MdastPluginDefinition[] {
  return [
    satteriStarlightGithubAlerts(
      StarlightGitHubAlertsConfigSchema.parse(options?.config),
      options?.markdownProcessorPaths ?? [fileURLToPath(new URL('src/content/docs/', import.meta.url))],
    ),
    satteriTestAsideRenderer(),
  ]
}

function satteriTestAsideRenderer() {
  return defineMdastPlugin({
    name: 'test-aside-renderer',
    containerDirective(node, ctx) {
      ctx.replaceNode(node, {
        type: 'paragraph',
        data: { hName: 'aside', hProperties: { class: node.name } },
        children: node.children as Paragraph['children'],
      })
    },
  })
}
