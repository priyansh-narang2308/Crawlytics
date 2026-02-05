import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in process.env. Make sure your .env file is loaded correctly.')
}

const dbUrl = process.env.DATABASE_URL
const url = new URL(dbUrl)
console.log('--- DB Connection Debug ---')
console.log('Host:', url.hostname)
console.log('Port:', url.port || '5432')
console.log('DATABASE_URL exists:', !!dbUrl)
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@')
  console.log('DATABASE_URL (masked):', maskedUrl)
}
console.log('---------------------------')

const pool = new pg.Pool({
  connectionString: dbUrl,
  max: 10,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false // Often needed for Neon/Postgres over SSL in some environments
  },
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

const adapter = new PrismaPg(pool)

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

