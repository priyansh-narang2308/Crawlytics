import { createServerFn } from '@tanstack/react-start'
import { firecrawl } from '@/lib/firecrawl'
import { importSingleSchema } from '@/schemas/import'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(importSingleSchema)
  .handler(async ({ data }) => {
    const result = await firecrawl.scrape(data.url, {
      formats: ['markdown'],
      onlyMainContent: true,
    })

    console.log(result)
  })
