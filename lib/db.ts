import { Pool } from "pg"

// Single shared connection pool for the app.
const globalForPool = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForPool.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool
}

export type Enquiry = {
  id: number
  phone: string
  message: string
  created_at: string
  status: string
}

export async function createEnquiry(phone: string, message: string) {
  const result = await pool.query<Enquiry>(
    `INSERT INTO enquiries (phone, message)
     VALUES ($1, $2)
     RETURNING id, phone, message, created_at, status`,
    [phone, message],
  )
  return result.rows[0]
}

export async function getEnquiries() {
  const result = await pool.query<Enquiry>(
    `SELECT id, phone, message, created_at, status
     FROM enquiries
     ORDER BY created_at DESC`,
  )
  return result.rows
}
