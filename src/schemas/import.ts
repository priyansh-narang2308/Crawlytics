import z from 'zod'

export const importSingleSchema = z.object({
  url: z.string().url(),
})

export const importBulkSchema = z.object({
  url: z.string().url(),
  search: z.string(), //to filter the urls
})

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})

export const searchSchema = z.object({
  query: z.string().min(1),
})
