import z from 'zod'

export const importSingleSchema = z.object({
  url: z.url(),
})

export const importBulkSchema=z.object({
    url:z.url(),
    search:z.string() //to filter the urls
})