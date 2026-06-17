export function isUnifiedProcessor(processor: unknown): processor is UnifiedMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { remarkPlugins?: unknown } }
  return candidate.name === 'unified' && Array.isArray(candidate.options?.remarkPlugins)
}

interface UnifiedMarkdownProcessor {
  name: string
  options: { remarkPlugins: unknown[] }
}
