# Calm & Contour — Project Context (read this first)

This file is the single source of truth for the Calm & Contour project. If you are an AI agent or a developer picking this up, read it top to bottom before making changes. It covers the business, where everything lives, how it works, what is done, what is outstanding, and the product roadmap.

_Last updated: 9 July 2026._

---

## 1. What the business is

**Calm & Contour** is a VIP mobile massage and body-contouring business in Mallorca, Spain. Lead therapist is **Parissa** (branding is moving to "Parissa & Friends" — a small team, not a solo). Clients book a massage at the studio or, more often, have a therapist come to their villa, yacht or hotel.

- Live site: **https://calmandcontour.com**
- Bookings/enquiries come in via an on-site AI chat (primary) and a booking form.
- Promoted with Google Ads (Search).
- WhatsApp for bookings: **+34 602 02 07 34**
- Studio address: **Calle Benito Jerónimo Feijoo 4, Portals Nous (Costa d'en Blanes), 07181 Mallorca** (Calvià, by Puerto Portals; ~10 min Magaluf, ~15 min Palma).
- Pricing (ladder set 11 Jul 2026; studio = €1.50/min): mobile €130/€155/€180 for 60/90/120 min. Studio €90/€135/€180. **The Ritual** (VIP, 120 min, warm oils + hot stones + hot towel rub down + herbal tea) €200 anywhere — 2-hour option ONLY, sits €20 above plain 120 min. ALL rituals (The Ritual, Serene Flow, Tension Release) are 2h-only, €200 anywhere. COUPLES REMOVED 11 Jul 2026 (no second therapist available) — two people = back-to-back sessions, same per-person prices; /couples-massage-mallorca page deleted.

**Business goal:** get more real leads into the team's hands and know the unit economics (cost per booking) so ad spend and team size can be scaled. Longer term, turn this into a booking + payment app (see Roadmap) and roll out city by city.

---

## 2. Where everything lives (access)

- **Code:** GitHub repo **https://github.com/tamainriley-byte/websites**, branch `main`. Every push to `main` auto-deploys to Vercel and is live within ~1–2 min.
- **Hosting:** Vercel project named **`websites`** (personal / Hobby scope).
  - WARNING: there is a separate, OLD project/folder called **`massage-website-with-booking`** on a different Vercel account ("Terry Pro"). That is NOT the live site. Ignore it. Live = the repo above → Vercel project `websites`.
- **Owner admin panel:** https://calmandcontour.com/admin — password **`Mallorcamassage`**. Shows every chat conversation (full transcript + device + city) and every booking-form enquiry.
- **Booking page:** https://calmandcontour.com/book
- **Google Ads:** account **806-912-8725**, campaign **"Calm & Contour - Search"** (campaignId `23988820494`, Ad group 1). Bidding = Maximize clicks, ~€25/day.
- **Database:** Neon Postgres (connection via `DATABASE_URL`). Tables: `enquiries`, `chat_sessions`, `chat_messages`. Schema auto-creates on first request (`ensureChatSchema` in `lib/db.ts`).

---

## 3. Tech stack & running locally

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · Neon Postgres via `pg` · deployed on Vercel. Package manager: **pnpm** (lockfile committed).

```bash
pnpm install
pnpm dev      # local dev at http://localhost:3000
pnpm build    # production build
pnpm lint
```

You need the env vars below (a `.env.local`) for the DB and AI chat to work locally. Deploy = push to `main` (Vercel builds automatically). **Changing an env var in Vercel does nothing until you redeploy.**

---

## 4. Environment variables (Vercel project `websites`)

- `ADMIN_PASSWORD` = Mallorcamassage
- `ANTHROPIC_API_KEY` = (set) — powers the AI chat. Model defaults to `claude-haiku-4-5`, override with `PARISSA_MODEL`. (Was `claude-3-5-haiku-latest`, which Anthropic retired 19 Feb 2026 — the chat silently fell back to keyword replies until fixed on 10 Jul 2026. If the chat ever "goes robotic" again, check the model ID is still current.)
- `DATABASE_URL` (+ the Neon/Postgres vars Vercel added) — Neon Postgres.
- `PARISSA_WHATSAPP` = 34602020734 — Parissa's number for lead alerts.
- `CALLMEBOT_APIKEY` = 2536053 — Parissa's CallMeBot key (free WhatsApp bridge; UNRELIABLE, see gotchas).
- `OWNER_WHATSAPP` + `OWNER_CALLMEBOT_APIKEY` = NOT set. Add to also alert the owner (Terry). Each recipient must activate CallMeBot for their own number.
- `RESEND_API_KEY` = NOT set. Required for the daily email report to actually send (free Resend account → API key). Until set, `/api/report` still computes the numbers but skips the email.
- `REPORT_EMAIL_TO` = optional, defaults to tamainriley@gmail.com. `REPORT_EMAIL_FROM` = optional, defaults to `onboarding@resend.dev` (works without domain verification, but only delivers to the Resend account owner's inbox — verify calmandcontour.com in Resend to send from the domain).
- `ADS_DAILY_BUDGET_EUR` = optional, defaults to 25. Used to estimate ad spend in the report (no Google Ads API access).
- `CRON_SECRET` = optional but recommended. When set, Vercel Cron authenticates to `/api/report` with it; a signed-in owner can always open `/api/report` in the browser regardless.
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` = NOT set. Required for Google Calendar booking. Setup: Google Cloud Console → new project → enable "Google Calendar API" → OAuth consent screen (External, add Parissa's email as test user) → Credentials → OAuth client ID (Web application) with redirect URI `https://calmandcontour.com/api/gcal/callback` → copy ID+secret into Vercel and redeploy. Then sign into `/admin` and click "Connect calendar" while signed into Parissa's Google account (one time). After that the chat AI sees her real free/busy and books confirmed appointments straight into her calendar.

---

## 5. Directory map

```
app/
  page.tsx                     Homepage (composes the components below)
  layout.tsx                   Root layout + Vercel Analytics + Google Ads gtag
  globals.css                  Tailwind v4 theme tokens
  admin/page.tsx               Owner inbox (conversations + enquiries)
  admin/actions.ts             Admin auth (password check, logout)
  book/page.tsx                Booking form page
  api/chat/route.ts            CHAT BACKEND (AI reply, capture, notify) — key file
  api/enquiries/route.ts       Booking-form submissions
  api/report/route.ts          Daily report endpoint (Vercel Cron, daily 18:00 UTC ≈ 8pm Mallorca) + cold-lead sweep backstop
  api/gcal/auth/route.ts       Starts Google Calendar OAuth (open while signed into /admin)
  api/gcal/callback/route.ts   OAuth callback, stores Parissa's refresh token
  lymphatic-drainage-mallorca/ SEO service page (signature treatment, ad group 9)
  ritual-massage-mallorca/     SEO service page (The Ritual, 2h VIP €200, ad group 10 cross-sell)
  serene-flow-ritual-mallorca/ Signature ritual page (2h lymphatic + Balinese, €200 anywhere)
  tension-release-massage-mallorca/ Signature ritual page (2h trigger point + myofascial, €200 anywhere)
  mobile-massage-mallorca/     SEO service page
  villa-massage-mallorca/      SEO service page (discretion/NDA angle)
  yacht-massage-mallorca/      SEO service page (onboard/NDA/crew)
  massage-near-me/             SEO service page ("near me", same-day)
  massage-palma/               SEO service page (Palma hotels/yachts)
  treatments/                  Lists all massage types + facials + pricing
components/
  site-header.tsx              Nav: navLinks[] + services[] drive desktop dropdown & mobile menu
  chat-widget.tsx              Floating on-site AI chat ("Chat with Parissa")
  cta-footer.tsx               Shared CTA + footer
  hero, about, treatments, pricing, gallery, book-form, admin-login-form
  ui/                          shadcn-style primitives
lib/
  db.ts                        All Postgres queries + types (incl. app_settings, cold-lead queries)
  gcal.ts                      Google Calendar: OAuth tokens, availability (free/busy), createBooking
  notify.ts                    Owner WhatsApp notifications: new-lead ping, final transcript, cold sweep
  report.ts                    Daily report (today + rolling 7 days): stats → recommendation → Resend email
  whatsapp.ts                  whatsappLink() + trackLeadConversion() (Google Ads event — fires on lead capture, NOT clicks)
  utils.ts                     cn() helper
vercel.json                    Cron: /api/report daily 18:00 UTC (≈ 8pm Mallorca)
GOOGLE-ADS.md                  Keyword-matched ad plan: 7 themed ad groups mapped 1:1 to service pages, RSA copy within limits, negatives, rollout checklist
public/images/                 Site imagery (hero-cove, villa-terrace, yacht-cabin, hotel-suite, body-contour, paris-*)
types/gtag.d.ts                gtag typing
```

---

## 6. Data model (Neon Postgres)

- `enquiries` (id, phone, message, created_at, status, booking_info) — booking-form + chat lead mirror. `status`: 'new' (lead) → 'booked' (confirmed) → 'shown' (client attended); 'booked' and 'shown' both count as bookings in stats. `booking_info` = human-readable "day at time, duration treatment, location" saved when the AI books, used to prefill the client's WhatsApp confirmation.
- `chat_sessions` (session_id PK, phone, name, ip, country, city, device, referer, created_at, last_at) — one row per chat visitor.
- `chat_messages` (id, session_id, role['user'|'assistant'], content, created_at) — every message.

Key `lib/db.ts` functions: `createEnquiry`, `getEnquiries`, `saveChatMessage`, `getChatHistory`, `registerChatClient`, `getSessionPhone`, `getConversations`, `ensureChatSchema`.

---

## 7. How the lead flow works (end to end)

1. **Every green button opens the on-site chat (OWNER DECISION, 11 Jul 2026).** History: buttons were intercepted 8–10 Jul while the AI was broken and leads collapsed; reverted to WhatsApp-direct on 10 Jul; owner reinstated full interception on 11 Jul now that the AI works, the number gate captures every chatter, and bookings write to the calendar. **Conversion moved off the click on 12 Jul 2026 (owner decision):** `trackLeadConversion()` fires only when a mobile number is saved in the chat or the booking form is submitted — a click alone no longer counts. **Watch the daily report: if leads drop again, raise it with the owner immediately.**
2. The chat's single composer starts as a **mobile capture bar** (`type=tel autocomplete=tel` → the phone offers the visitor's own number, 7–15 digit check) and becomes the message box once a number is saved — so every chatter is captured before they can talk. Numbers typed in chat are also captured inline (`extractPhone`).
3. `app/api/chat/route.ts` generates replies with Claude (system prompt = warm, texts like Parissa, never says it's an AI; suggests coming to them first; gathers style + 60/90 minutes + day/time + address; asks for the mobile last if not captured). If `ANTHROPIC_API_KEY` is missing it falls back to keyword replies.
4. **Google Calendar (once connected):** the AI is given Parissa's real free slots (next 7 days, from free/busy) and only offers those times. When the client agrees all details it calls the `book_appointment` tool → event written to her calendar, the lead auto-marked `booked` in enquiries, and Parissa WhatsApp'd "Confirmed booking ✅". Not connected → provisional bookings as before.
5. On number capture: saved to `chat_sessions`, mirrored to `enquiries`, and `notifyOwners` WhatsApps Parissa (and owner if `OWNER_*` set) with the transcript so far.
6. **Conversation end:** when the visitor closes the page (widget `pagehide` beacon → `type:"left"`) or goes quiet 15+ min (sweep piggybacked on chat traffic + daily cron), Parissa gets the FINAL transcript once: "They've left the chat 📞 Call this lead now." (`closed_notified_at` guards double-sends.)
7. Everything is visible in `/admin`. Bookings are managed ON each chat card (12 Jul 2026): status chip (New / Booked ✓ / Shown ✓) + buttons — Mark booked, Mark shown, Undo, **WhatsApp confirmation** (opens WhatsApp to the CLIENT with the confirmation prefilled from `booking_info` — date, time, treatment, address — one tap to send) and **Reschedule** (prefilled "could we look at another time?"). The same one-tap confirmation link is included in Parissa's "Confirmed booking ✅" CallMeBot ping. The separate "Booking form enquiries" list now shows only non-chat (form) leads. NOTE: client-facing WhatsApp cannot be sent automatically without the paid WhatsApp Business API — CallMeBot only delivers to numbers that activated it. Prefilled one-tap from Parissa's phone is the free workaround; the AI also always repeats date/time/duration/address in its in-chat confirmation.

---

## 8. Google Ads — current state & gotchas

- Campaign "Calm & Contour - Search" is the live one. Demand Gen / "dynamic" campaigns were paused (low-intent leads, poor conversion — the callers who hung up).
- The campaign has **76 keywords** (confirmed on-screen). Many specific "money terms" (e.g. "poolside massage mallorca", "boat massage mallorca") are **"Not eligible — Low search volume"** so they don't serve. Fix = run those as **broad match with a tight negative-keyword list**, not more ultra-specific phrases. Only broad generic terms (massage studio, massage and wellness) are getting clicks — which brings wrong-fit studio requests.
- **"Conversions" in Google Ads = captured leads (mobile saved in chat, or booking form sent) since 12 Jul 2026.** Before that date a conversion was just a click on a green button, so older conversion counts are inflated — don't compare across the boundary. A lead still ≠ a booking; don't read conversions as revenue. Bidding is Maximize clicks so the change disturbs nothing; only switch to Maximize conversions once there are 15+ conversions in the last 30 days.

---

## 9. Analytics — current state

Only **Vercel Analytics** (aggregate pageviews) and the **Google Ads gtag** (conversion counting) are installed. There is NO session recording / heatmap tool. To see where visitors drop, install **Microsoft Clarity** (free): create a project, add its script to `app/layout.tsx`. (Needs a Clarity project ID from the owner.)

---

## 10. What was shipped in the last session (all on `main`)

1. Green buttons open the on-site AI chat (stay on platform, capture + book on-site). `chat-widget.tsx`
2. Chat rebuilt: no phone-number wall, opens into conversation. `chat-widget.tsx`
3. AI booking flow: answers questions, gathers treatment/time/address, provisional-booking handoff. `route.ts`
4. Inline number capture + mirror to enquiries. `route.ts` + `getSessionPhone` in `db.ts`
5. Owner WhatsApp alert on capture (`notifyOwners`) with the "potential client entered their number / call if they go cold" wording, dual-recipient. `route.ts`
6. Four new SEO service pages: yacht, massage-near-me, massage-palma, treatments.
7. Header nav wired: Treatments → /treatments; Services menu lists all six pages (desktop + mobile).
8. **Booked toggle** in `/admin` (Mark booked / Undo booked per enquiry + booked count in the header). `admin/page.tsx`, `admin/actions.ts`, `updateEnquiryStatus` in `db.ts`.
9. **Daily email report** (today's leads/bookings + rolling 7-day cost per lead / cost per booking + SCALE/HOLD/CUT recommendation) via `/api/report` + Vercel Cron, emailed with Resend once `RESEND_API_KEY` is set. `lib/report.ts`, `api/report/route.ts`, `vercel.json`.
10. **AI chat fixed** — default model was retired (`claude-3-5-haiku-latest` → 404 since 19 Feb 2026, silent keyword fallback); now `claude-haiku-4-5`.
11. **One-tap mobile capture bar** in the chat widget + **final-transcript notification** when the visitor leaves (beacon) or goes cold (sweep). `chat-widget.tsx`, `lib/notify.ts`, `db.ts`.
12. **Google Calendar direct booking** — availability injected into the AI, `book_appointment` tool writes confirmed bookings to Parissa's calendar, auto-marks lead booked, WhatsApps her. Needs `GOOGLE_CLIENT_ID/SECRET` + one-time connect from /admin. `lib/gcal.ts`, `api/gcal/*`.
13. `/treatments` H1 now "Massage Treatments in Mallorca". (A couples page was added then removed same week — couples paused, no second therapist.)
14. **GOOGLE-ADS.md** — full keyword-matched ad plan ready to paste into Google Ads.

---

## 11. Outstanding / next tasks

**Reporting & economics (highest near-term value)**
- ~~Add a **"booked" toggle** in `/admin`~~ DONE — each enquiry card has a Mark booked / Undo booked button (`setBooked` in `admin/actions.ts`, sets `enquiries.status = 'booked'`).
- ~~**Daily email report**~~ BUILT, needs activation: `/api/report` + `lib/report.ts` compute today's leads/bookings plus rolling 7-day ad spend (est.), cost per lead, cost per booking and a SCALE/HOLD/CUT recommendation vs the ~€35 margin; Vercel Cron fires it daily at 18:00 UTC = 8pm Mallorca in summer, 7pm in winter (cron is UTC; adjust `vercel.json` in late October if the owner cares). **To activate: set `RESEND_API_KEY` in Vercel and redeploy.** Preview any time by opening `/api/report?send=0` while signed into `/admin`.
- ~~"Go cold" nudge~~ DONE — page-close beacon + 15-min sweep send Parissa the final transcript (see section 7).

**Notifications / reliability**
- Replace CallMeBot with a reliable channel (email digest now; paid WhatsApp / transactional email later). To turn on the owner's alert now: set `OWNER_WHATSAPP` + `OWNER_CALLMEBOT_APIKEY` and redeploy.

**Google Ads**
- ~~Rebuild keyword strategy + themed ad groups~~ PLAN WRITTEN — see `GOOGLE-ADS.md` (7 ad groups mapped 1:1 to service pages, RSA copy pre-validated for the 30/90 char limits, shared negatives, rollout checklist). **To activate: paste it into the Google Ads account** (no API access from code). Do NOT claim "voted best on Reddit" unless genuinely true (false-advertising / disapproval risk).

**Website**
- Thread "Parissa & Friends" branding through site + chat; fix any "Paris Elizabeth" → Parissa in the About section.
- Live blog section; migrate old Wix blog posts at their exact old URLs.
- Re-add the promo reel video (a 22.5s `Calm-and-Contour-reel.mp4` was produced but is NOT in the repo) to `public/` and wire a `<video>`; use varied imagery per page.
- "Join our VIP list" email capture.
- Admin: reply box + "takeover" toggle (mute AI so a human replies) + contacts page + optional SMS marketing.
- Install Microsoft Clarity.

**Growth**
- Reddit / AI-search presence.

---

## 12. Product roadmap (the app vision)

The direction is a booking + payment platform. Build order:

- **Phase 1 (LIVE):** on-site AI chat captures leads to `/admin`; daily email report + cost-per-booking (needs the booked toggle).
- **Phase 2 — Booking management:** confirmed date/time with client self-reschedule; special-requests field; "what happens in your massage" explainer; **therapist availability via Google Calendar** (free API, OAuth per therapist; app reads free/busy and writes bookings).
- **Phase 3 — Payments (Stripe):** card on file for VIP members. NEVER store raw card numbers — use Stripe SetupIntent / Payment Element / Checkout (card vaulted by Stripe, app holds only a token). In-app 60→90 min extensions and add-ons charge the saved card. Optional booking deposit to cut no-shows.
- **Phase 4 — Retention:** post-massage feedback (how they feel, more/less of); one-tap re-book.
- **Phase 5 — Referral & loyalty:** referral programme; **VIP Gold** tier (refer 3+ → cancellation priority + late-evening slots).
- **Phase 6 — Marketplace & scale:** multi-therapist onboarding/vetting/availability/payouts (Stripe Connect, owner takes ~€35/booking); multi-city rollout (same playbook: local Search ads + locally recruited vetted therapists).

Conversion insight: Search leads are high-intent and convert well (est. 50–60%+); Demand Gen leads are low-intent. Keep spend on Search.

---

## 13. Conventions & gotchas

- **Deploy = push to `main`.** Redeploy required after any Vercel env-var change.
- **Payments:** Stripe only; never store PANs; Stripe Connect for splitting money with therapists.
- **Google Calendar API is free** at this scale (Google app-verification needed only once you have many external OAuth users).
- **GDPR:** we store personal data + massage preferences (health-adjacent). Add a privacy policy, explicit signup consent, and data-deletion on request.
- **CallMeBot is unreliable** (free, rate-limited, drops messages) — fine for a nudge, not for anything critical.
- **Economics gate:** build a phase only while cost-per-booking stays comfortably under the ~€35 margin. That weekly number decides when to add therapists, raise spend, and open a new city.
