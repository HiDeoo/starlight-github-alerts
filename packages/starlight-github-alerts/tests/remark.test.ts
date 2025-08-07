import { fileURLToPath } from 'node:url'

import remarkDirective from 'remark-directive'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { VFile } from 'vfile'
import { expect, test } from 'vitest'

import { StarlightGitHubAlertsConfigSchema, type StarlightGitHubAlertsUserConfig } from '../libs/config'
import { remarkStarlightGitHubAlerts } from '../libs/remark'

const processor = createMarkdownProcessor()

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

  expect(res.value).toMatchInlineSnapshot(`
    ":::note
    Useful information that users should know, even when skimming content.
    :::

    :::tip
    Helpful advice for doing things better or more easily.
    :::

    :::caution
    Key information users need to know to achieve their goal.
    :::

    :::caution
    Urgent info that needs immediate user attention to avoid problems.
    :::

    :::danger
    Advises about risks or negative outcomes of certain actions.
    :::
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

  expect(res.value).toMatchInlineSnapshot(`
    ":::danger
    A note alert that is mapped to the danger type.
    :::
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

  expect(res.value).toMatchInlineSnapshot(`
    "## Complex Alert

    :::note
    This is a complex alert with multiple paragraphs.

    And even a nested blockquote:

    > Something that is quoted.

    And even some code:

    \`\`\`js
    console.log('Hello, world!');
    \`\`\`
    :::
    "
  `)
})

test('does not transform unknown alerts', async () => {
  const res = await renderMarkdown(`
> [!DANGER]
> An alert type that is not valid.
`)

  expect(res.value).toMatchInlineSnapshot(`
    "> \\[!DANGER]
    > An alert type that is not valid.
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

  expect(res.value).toMatchInlineSnapshot(`
    ":::note
    Useful information that users should know, even when skimming content.

    > \\[!NOTE]
    > A nested alert that should not be transformed.
    :::
    "
  `)
})

test('does not transform alerts for file not part of the docs collection', async () => {
  const res = await renderMarkdown(
    `
> [!NOTE]
> An alert not part of the docs collection.
`,
    { url: new URL(`src/content/test/index.md`, import.meta.url) },
  )

  expect(res.value).toMatchInlineSnapshot(`
    "> \\[!NOTE]
    > An alert not part of the docs collection.
    "
  `)
})

function renderMarkdown(
  content: string,
  options?: { config?: StarlightGitHubAlertsUserConfig; docsCollectionPath?: string; url?: URL | undefined },
) {
  return (options?.config || options?.docsCollectionPath ? createMarkdownProcessor(options) : processor).process(
    new VFile({
      path: fileURLToPath(options?.url ?? new URL(`src/content/docs/index.md`, import.meta.url)),
      value: content,
    }),
  )
}

function createMarkdownProcessor(options?: Parameters<typeof renderMarkdown>[1]) {
  return unified()
    .use(remarkParse)
    .use(remarkStarlightGitHubAlerts, {
      config: StarlightGitHubAlertsConfigSchema.parse(options?.config),
      docsCollectionPath: options?.docsCollectionPath ?? fileURLToPath(new URL('src/content/docs/', import.meta.url)),
    })
    .use(remarkDirective)
    .use(remarkStringify)
}
