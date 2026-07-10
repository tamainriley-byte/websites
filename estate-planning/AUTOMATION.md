# AUTOMATION.md — The Pipeline: Drive → Edit → Approve → Everywhere

Design principle: **automate the plumbing, keep humans on taste and compliance.**
Two human touchpoints survive automation forever: (1) the editor choosing the hook +
wow graphic, (2) adviser/compliance approval. Everything else is machinery.

---

## 1. The pipeline, end to end

```
Adviser phone
   │  uploads raw clip to Drive /01-INBOX/<adviser>/
   ▼
[A] Intake automation
   │  new-file trigger → transcribe → draft caption + hook suggestions (AI)
   │  → create Content Sheet row (RAW) → notify editor
   ▼
Editor applies the template (PRODUCTION.md) → exports variants → /03-REVIEW
   │
   ▼
[B] Review automation
   │  → sends adviser a one-tap approve link (their own face — they approve fast)
   │  → IFA clips: also route to compliance sign-off; blocks until both approve
   │  → approved: move to /04-APPROVED, status APPROVED
   ▼
[C] Publishing automation
   │  watches /04-APPROVED + posting calendar
   │  → posts native video + caption to: TikTok, IG Reels, YouTube Shorts,
   │     Facebook (firm accounts) — and pushes to the adviser's own accounts
   │     via the scheduler's multi-profile setup
   │  → LinkedIn: DMs the adviser their clip + ready-made text post to publish
   │     personally (personal posts outperform company pushes ~5:1 there)
   │  → embeds go to the matching website page (VideoObject schema auto-filled
   │     from the sheet row)
   │  → moves file to /05-POSTED, stamps post URLs into the sheet
   ▼
[D] Reporting automation
      nightly: pulls views/likes/shares/watch-through per post per channel into the
      sheet → weekly digest email: top 5 clips, flop 5, per-adviser totals, quiz
      starts/completions, booked calls → "promote these 3" PPC shortlist
```

## 2. Tooling choices

- **Orchestration: Make.com** (already in our stack). Four scenarios matching A–D
  above. Drive triggers, sheet updates, webhook to the scheduler, notification
  emails/WhatsApps.
- **Scheduler/publisher:** Metricool, Blotato or similar with API access — must
  support TikTok + Reels + Shorts + Facebook native video posting and
  multi-profile (17 adviser profiles + firm accounts). This is the one paid tool
  that matters; pick on API quality.
- **Transcription + caption drafting:** Whisper-class transcription + Claude for
  captions/hook suggestions in the adviser's voice (prompt includes their 3 most
  recent captions so voice stays consistent).
- **AI video (33 Things):** HeyGen/Higgsfield-class generation for presenter-style
  explainers, or motion-graphics template + AI voiceover. Same review flow, folder
  `/07-AI-SERIES`.
- **Approvals:** the review link is just the Drive file + an approve button
  (Make webhook) — no new app for advisers to learn.

## 3. Posting matrix & timing

| Channel | Account | What | Cadence |
|---|---|---|---|
| TikTok | Firm + adviser's own | every short | 3–4/day firm; 1/week adviser |
| IG Reels | Firm + adviser's own | every short | 2–3/day firm |
| YT Shorts | Firm | every short | 2–3/day |
| YouTube | Firm | weekly best-of episode + 33 Things compilations | 1–2/week |
| Facebook | Firm page | every short + Score posts | 2/day |
| LinkedIn | Adviser personal | their own clip + text version | 1/week each |
| Email | Firm | best story of the week + Score nudge | 1/week |

Stagger channels by 30–60 min per clip (platforms de-prioritise simultaneous
cross-posts). Queue depth: keep 2 weeks of APPROVED inventory so holidays/quiet
weeks never break the cadence.

## 4. Website & schema automation

- Each published clip auto-creates/updates the embed on its matching page
  (adviser bio page + relevant topic page) with `VideoObject` JSON-LD filled from
  the sheet (title, description, thumbnail, duration, uploadDate, contentUrl).
- 33 Things pages (`/things/nn-slug`): `HowTo` + `FAQPage` + `VideoObject`.
- `/estate-score`: `Quiz` schema; adviser pages: `Person` schema; sitewide:
  `Organization` + `sameAs` for every social profile (see README §7).
- Sitemap pings on every new page/embed so video rich results index fast.

## 5. Failure modes to design for (learned from Calm & Contour)

- **Silent AI fallbacks:** if transcription/caption AI fails, the pipeline must flag
  loudly (WhatsApp/email the content lead), never post a clip with broken captions.
- **Model retirement:** pin AI model IDs in one config, check monthly (the chat-bot
  went "robotic" for months when a model was silently retired).
- **Free notification bridges are unreliable** — use email + the sheet as the source
  of truth; WhatsApp pings are a bonus, not the system.
- **Metric honesty:** views are not leads; leads are not clients. The weekly digest
  always ends at: quiz completions → booked calls → signed clients → cost per signed
  client. Scale decisions only from that last number.

## 6. Build order

1. **Manual first, same shapes (Week 1–2):** Drive folders + Content Sheet + human
   posting via the scheduler UI. Prove the flow with the 3-adviser pilot.
2. **Scenario A (intake)** — biggest time-saver, zero risk.
3. **Scenario C (publishing)** — once 20+ clips have posted manually and the timing
   matrix is validated.
4. **Scenario B (approvals)** — after compliance agrees the sign-off UX.
5. **Scenario D (reporting)** — as soon as there are two weeks of posts to report on.
