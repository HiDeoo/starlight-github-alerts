import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [{ test: { name: 'unit', include: ['tests/*.test.ts'] } }, 'tests/fixtures/*/vitest.config.ts'],
  },
})
