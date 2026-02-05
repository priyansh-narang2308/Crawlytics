import { createServerFn } from '@tanstack/react-start'
import { firecrawl } from '@/lib/firecrawl'
import {
  extractSchema,
  importBulkSchema,
  importSingleSchema,
  searchSchema,
} from '@/schemas/import'
import { prisma } from '@/db'
import z from 'zod'
import { authFnMiddleware } from '@/middlewares/auth'
import { notFound } from '@tanstack/react-router'
import { generateText } from 'ai'
import { openrouter } from '@/lib/open-router'
import { SearchResultWeb } from '@mendable/firecrawl-js'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSingleSchema)
  .handler(async ({ data, context }) => {
    const item = await prisma.savedItem.create({
      data: {
        url: data.url,
        userId: context.session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      const result = await firecrawl.scrape(data.url, {
        formats: [
          'markdown',
          {
            type: 'json',
            // schema: extractSchema,
            prompt: "Please extract the author name and the published at date, the timestamp"
          },
        ],
        location: { country: 'US', languages: ['en'] },
        onlyMainContent: true,
      })

      // Ftech it from the schemas
      const jsonData = result.json as z.infer<typeof extractSchema>

      console.log(jsonData)

      let publishedAt = null

      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)

        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed
        }
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: result.metadata?.title || null,
          content: result.markdown || null,
          ogImage: result.metadata?.ogImage || null,
          author: jsonData.author || null,
          publishedAt: publishedAt,
          status: 'COMPLETED',
        },
      })

      return updatedItem
    } catch (error) {
      const failedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          status: 'FAILED',
        },
      })

      return failedItem
    }
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importBulkSchema)
  .handler(async ({ data }) => {
    const result = await firecrawl.map(data.url, {
      limit: 25,
      search: data.search,
      location: {
        country: 'US',
        languages: ['en'],
      },
    })

    return result.links
  })

export const bulkScrapeUrlsFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ urls: z.array(z.string().url()) }))
  .handler(async ({ data, context }) => {
    const encoder = new TextEncoder()
    const urls = data.urls

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i]

          // Emit initial processing state
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                current: i + 1,
                total: urls.length,
                url,
                status: 'processing',
              }) + '\n',
            ),
          )

          try {
            const item = await prisma.savedItem.create({
              data: {
                url: url,
                userId: context.session.user.id,
                status: 'PENDING',
              },
            })

            const result = await firecrawl.scrape(url, {
              formats: [
                'markdown',
                {
                  type: 'json',
                  // schema: extractSchema,
                  prompt: "Please extract the author name and the published at timestamp."
                },
              ],
              location: { country: 'US', languages: ['en'] },
              onlyMainContent: true,
              proxy: 'auto',
            })

            const jsonData = result.json as z.infer<typeof extractSchema>
            let publishedAt = null
            if (jsonData?.publishedAt) {
              const parsed = new Date(jsonData.publishedAt)
              if (!isNaN(parsed.getTime())) {
                publishedAt = parsed
              }
            }

            await prisma.savedItem.update({
              where: { id: item.id },
              data: {
                title: result.metadata?.title || null,
                content: result.markdown || null,
                ogImage: result.metadata?.ogImage || null,
                author: jsonData?.author || null,
                publishedAt: publishedAt,
                status: 'COMPLETED',
              },
            })

            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  current: i + 1,
                  total: urls.length,
                  url,
                  status: 'completed',
                }) + '\n',
              ),
            )
          } catch (error) {
            console.error(`Error scraping ${url}:`, error)
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  current: i + 1,
                  total: urls.length,
                  url,
                  status: 'failed',
                }) + '\n',
              ),
            )
          }
        }

        // Final done signal
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              status: 'done',
            }) + '\n',
          ),
        )
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const items = await prisma.savedItem.findMany({
      where: {
        userId: context.session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return items
  })

// for infivisual item
export const getItemById = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const item = await prisma.savedItem.findUnique({
      where: {
        userId: context.session.user.id,
        id: data.id,
      },
    })

    if (!item) {
      throw notFound()
    }

    return item
  })

// Save the AI generated summary
export const saveSummaryFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string(), summary: z.string() }))
  .handler(async ({ data, context }) => {
    const existing = await prisma.savedItem.findUnique({
      where: {
        id: data.id,
        userId: context.session.user.id,
      },
    })

    if (!existing) {
      throw notFound()
    }

    const { text } = await generateText({
      model: openrouter.chat('z-ai/glm-4.5-air:free'),
      system: `You are a helpful assistant that extracts relevant tags from
content summaries.
Extract 3-5 short, relevant tags that categorize the content.
Return ONLY a comma-separated list of tags, nothing else.
Example: technology, programming, web development, javascript`,
      prompt: `Extract tags from this summary: \n\n${data.summary}`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    const item = await prisma.savedItem.update({
      where: {
        userId: context.session.user.id,
        id: data.id,
      },
      data: {
        summary: data.summary,
        tags: tags,
      },
    })

    return item
  })

export const searchWebFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(searchSchema)
  .handler(async ({ data }) => {
    const result = await firecrawl.search(data.query, {
      limit: 12,
      location: 'India',
      tbs: 'qdr:y',
    })

    return result.web?.map((item) => ({
      url: (item as SearchResultWeb).url,
      title: (item as SearchResultWeb).title,
      description: (item as SearchResultWeb).description,
    })) as SearchResultWeb[]

  })
