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

// "booked" marks a confirmed booking; anything else counts as just a lead.
export async function updateEnquiryStatus(id: number, status: string) {
  await pool.query(`UPDATE enquiries SET status = $2 WHERE id = $1`, [
    id,
    status,
  ])
}

export type WeeklyStats = {
  leads: number
  uniqueLeads: number
  booked: number
  bookedAllTime: number
}

// Lead + booking counts for the weekly report. Unique leads dedupe by phone
// (the same client can arrive via both the chat mirror and the form).
export async function getWeeklyStats(days = 7): Promise<WeeklyStats> {
  const week = await pool.query<{
    leads: string
    unique_leads: string
    booked: string
  }>(
    `SELECT COUNT(*) AS leads,
            COUNT(DISTINCT phone) AS unique_leads,
            COUNT(*) FILTER (WHERE status = 'booked') AS booked
     FROM enquiries
     WHERE created_at >= now() - ($1 || ' days')::interval`,
    [days],
  )
  const allTime = await pool.query<{ booked: string }>(
    `SELECT COUNT(*) AS booked FROM enquiries WHERE status = 'booked'`,
  )
  const w = week.rows[0]
  return {
    leads: Number(w?.leads ?? 0),
    uniqueLeads: Number(w?.unique_leads ?? 0),
    booked: Number(w?.booked ?? 0),
    bookedAllTime: Number(allTime.rows[0]?.booked ?? 0),
  }
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
  ai_muted: boolean
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
      // Set when Parissa has been sent the FINAL transcript (visitor left or
      // went cold) so she's only pinged once per conversation.
      await pool.query(
        `ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS closed_notified_at TIMESTAMPTZ;`,
      )
      // Takeover: when true the AI stays silent and Parissa replies herself
      // from /admin.
      await pool.query(
        `ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS ai_muted BOOLEAN NOT NULL DEFAULT false;`,
      )
      // Small key/value store (Google Calendar refresh token, etc.).
      await pool.query(`
        CREATE TABLE IF NOT EXISTS app_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `)
      // One-time cleanup: the first bot version replied with canned lines
      // pointing people at WhatsApp; they linger in saved histories and
      // replay when a visitor re-opens the chat. Remove them everywhere.
      await pool.query(
        `DELETE FROM chat_messages
         WHERE role = 'assistant'
           AND (content LIKE '%Can you WhatsApp me on +34602020734%'
             OR content LIKE '%drop your mobile number here so I can confirm everything personally%')`,
      )
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

export async function getSessionPhone(
  sessionId: string,
): Promise<string | null> {
  const r = await pool.query<{ phone: string | null }>(
    `SELECT phone FROM chat_sessions WHERE session_id = $1`,
    [sessionId],
  )
  return r.rows[0]?.phone ?? null
}

// Phone + takeover flag in one query (used on every chat message).
export async function getSessionState(
  sessionId: string,
): Promise<{ phone: string | null; ai_muted: boolean }> {
  const r = await pool.query<{ phone: string | null; ai_muted: boolean }>(
    `SELECT phone, ai_muted FROM chat_sessions WHERE session_id = $1`,
    [sessionId],
  )
  return r.rows[0] ?? { phone: null, ai_muted: false }
}

// Takeover toggle: true = AI silent, Parissa replies from /admin.
export async function setAiMuted(sessionId: string, muted: boolean) {
  await pool.query(
    `UPDATE chat_sessions SET ai_muted = $2 WHERE session_id = $1`,
    [sessionId, muted],
  )
}

/* ------------------------------------------------------------------ */
/*  App settings (key/value)                                          */
/* ------------------------------------------------------------------ */

export async function getSetting(key: string): Promise<string | null> {
  const r = await pool.query<{ value: string }>(
    `SELECT value FROM app_settings WHERE key = $1`,
    [key],
  )
  return r.rows[0]?.value ?? null
}

export async function setSetting(key: string, value: string) {
  await pool.query(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, value],
  )
}

/* ------------------------------------------------------------------ */
/*  Cold / finished conversation detection                            */
/* ------------------------------------------------------------------ */

// Captured leads (phone on file) whose conversation has gone quiet and who
// haven't had a final-transcript notification yet.
export async function findColdSessions(minutes = 15): Promise<ChatSession[]> {
  const r = await pool.query<ChatSession>(
    `SELECT session_id, phone, name, ip, country, city, device, referer,
            created_at, last_at, ai_muted
     FROM chat_sessions
     WHERE phone IS NOT NULL
       AND closed_notified_at IS NULL
       AND last_at < now() - ($1 || ' minutes')::interval
       AND session_id IN (
         SELECT DISTINCT session_id FROM chat_messages WHERE role = 'user'
       )`,
    [minutes],
  )
  return r.rows
}

// Returns true if this call claimed the notification (guards double-sends
// when the beacon and the sweep race each other).
export async function claimClosedNotification(
  sessionId: string,
): Promise<boolean> {
  const r = await pool.query(
    `UPDATE chat_sessions SET closed_notified_at = now()
     WHERE session_id = $1 AND closed_notified_at IS NULL AND phone IS NOT NULL`,
    [sessionId],
  )
  return (r.rowCount ?? 0) > 0
}

// Marks the latest enquiry for this phone as booked (used when the AI writes
// a confirmed booking into the calendar).
export async function markBookedByPhone(phone: string) {
  await pool.query(
    `UPDATE enquiries SET status = 'booked'
     WHERE id = (
       SELECT id FROM enquiries WHERE phone = $1 ORDER BY created_at DESC LIMIT 1
     )`,
    [phone],
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
            created_at, last_at, ai_muted
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
