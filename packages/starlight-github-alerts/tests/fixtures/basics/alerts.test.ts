import { expect, test } from 'vitest'

test('renders alerts', async () => {
  const { compiledContent } = await import('./src/content/docs/alerts.md')

  const html = await compiledContent()

  expect(html).not.toContain('[!NOTE]')
  expect(html).toContain('starlight-aside--note')
})
