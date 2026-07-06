import { Pool } from "pg"

// Single shared connection pool for the app.
const globalForPool = globalThis as unknown as { pgPool?: Pool }

export const pool =
  globalForPool.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== "production") {
  globalForPool.pgPool = pool
}

/* ------------------------------------------------------------------ */
/*  Enquiries (booking form)                                          */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Chat (in-site "WhatsApp" conversations)                           */
/* ------------------------------------------------------------------ */

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: number
  session_id: string
  role: ChatRole
  content: string
  created_at: string
}

export type ChatSession = {
  session_id: string
  phone: string | null
  name: string | null
  ip: string | null
  country: string | null
  city: string | null
  device: string | null
  referer: string | null
  created_at: string
  last_at: string
}

export type SessionMeta = {
  ip?: string | null
  country?: string | null
  city?: string | null
  device?: string | null
  referer?: string | null
}

let schemaReady: Promise<void> | null = null

// Create the chat tables on first use so no manual migration is needed.
export function ensureChatSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          session_id TEXT PRIMARY KEY,
          phone TEXT,
          name TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          last_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id SERIAL PRIMARY KEY,
          session_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `)
      await pool.query(
        `CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, id);`,
      )
      // Source / device columns (added over time).
      await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS ip TEXT;`)
      await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS country TEXT;`)
      await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS city TEXT;`)
      await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS device TEXT;`)
      await pool.query(`ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS referer TEXT;`)
    })().catch((err) => {
      // Reset so a later call can retry.
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}

export async function touchSession(sessionId: string) {
  await pool.query(
    `INSERT INTO chat_sessions (session_id)
     VALUES ($1)
     ON CONFLICT (session_id)
     DO UPDATE SET last_at = now()`,
    [sessionId],
  )
}

// Store where the visitor came from. Keeps the first value seen for each
// field (COALESCE) so we record their entry point, not later navigation.
export async function setSessionMeta(sessionId: string, meta: SessionMeta) {
  await pool.query(
    `INSERT INTO chat_sessions (session_id, ip, country, city, device, referer)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (session_id)
     DO UPDATE SET
       ip = COALESCE(chat_sessions.ip, EXCLUDED.ip),
       country = COALESCE(chat_sessions.country, EXCLUDED.country),
       city = COALESCE(chat_sessions.city, EXCLUDED.city),
       device = COALESCE(chat_sessions.device, EXCLUDED.device),
       referer = COALESCE(chat_sessions.referer, EXCLUDED.referer),
       last_at = now()`,
    [
      sessionId,
      meta.ip ?? null,
      meta.country ?? null,
      meta.city ?? null,
      meta.device ?? null,
      meta.referer ?? null,
    ],
  )
}

export async function saveChatMessage(
  sessionId: string,
  role: ChatRole,
  content: string,
) {
  await touchSession(sessionId)
  const result = await pool.query<ChatMessage>(
    `INSERT INTO chat_messages (session_id, role, content)
     VALUES ($1, $2, $3)
     RETURNING id, session_id, role, content, created_at`,
    [sessionId, role, content],
  )
  return result.rows[0]
}

export async function getChatHistory(sessionId: string) {
  const result = await pool.query<ChatMessage>(
    `SELECT id, session_id, role, content, created_at
     FROM chat_messages
     WHERE session_id = $1
     ORDER BY id ASC`,
    [sessionId],
  )
  return result.rows
}

export async function registerChatClient(
  sessionId: string,
  phone: string,
  name: string | null,
) {
  await pool.query(
    `INSERT INTO chat_sessions (session_id, phone, name, last_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (session_id)
     DO UPDATE SET phone = EXCLUDED.phone,
                   name = COALESCE(EXCLUDED.name, chat_sessions.name),
                   last_at = now()`,
    [sessionId, phone, name],
  )
}

export type Conversation = ChatSession & {
  message_count: number
  last_message: string | null
  messages: ChatMessage[]
}

// All conversations for the admin view, newest activity first, with messages.
export async function getConversations(): Promise<Conversation[]> {
  const sessions = await pool.query<ChatSession>(
    `SELECT session_id, phone, name, ip, country, city, device, referer,
            created_at, last_at
     FROM chat_sessions
     WHERE session_id IN (SELECT DISTINCT session_id FROM chat_messages)
     ORDER BY last_at DESC`,
  )

  const conversations: Conversation[] = []
  for (const s of sessions.rows) {
    const msgs = await getChatHistory(s.session_id)
    conversations.push({
      ...s,
      message_count: msgs.length,
      last_message: msgs.length ? msgs[msgs.length - 1].content : null,
      messages: msgs,
    })
  }
  return conversations
}
