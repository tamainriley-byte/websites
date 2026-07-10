# The Estate Planning Content Engine — Master Playbook

**The one-line vision:** 17 advisers (12 estate planners + 5 IFAs) each film one 60-second
POV client story per week on their phone, drop it in Google Drive, and an automated
pipeline turns it into a branded, real-estate-show-style clip posted to every channel —
plus AI explainer videos, a viral "Estate Score" health check, schema-perfect web pages
and PPC behind the winners. Nobody owns this space. We become the household name in
estate planning.

_Last updated: 10 July 2026._

---

## The docs in this folder

| File | What it is |
|---|---|
| `README.md` | This playbook — strategy, brand, channels, PPC, schema, theme tune, rollout |
| `SCRIPTS.md` | The script bank: the Client Story formula + 45+ ready-to-film scripts |
| `ESTATE-SCORE.md` | The health-check product: naming, scoring model, quiz, scripts |
| `33-THINGS.md` | "33 Things To Do Before You Die" — the full list + AI-video hooks |
| `PRODUCTION.md` | How advisers film (POV rules), the edit template, Drive structure |
| `AUTOMATION.md` | The end-to-end pipeline: Drive → edit → approve → post everywhere |

---

## 1. Why this works

- **Transparency is the moat.** Estate planning is opaque, awkward, avoided. Advisers
  talking warmly and honestly about real (anonymised) client moments is content nobody
  else in the category is making. Real estate TV proved the format: behind-the-scenes +
  personalities + big graphics = bingeable.
- **The story is never the paperwork.** Every video lands on the human "thing" — the
  quarterly family meal funded by tax savings, the letter for a grandchild's 18th.
  Wills and trusts are the how; the family moment is the why. That's what gets shared.
- **Volume compounds.** 17 advisers × 1 clip/week = ~75 raw stories/month. Add AI
  explainers and Estate Score content and we're publishing 25–30 posts/week across
  5+ channels without any adviser spending more than 15 minutes filming.
- **Each adviser builds their own following** — leads flow to the person in the video,
  which is exactly the incentive that keeps them filming.

## 2. The show

Treat the whole output as a show, not "social posts". A show has a name, an intro
sting, recurring segments, consistent graphics and a catchphrase.

**Show name (recommended): "Where There's a Will"** — warm, memorable, instantly says
what we do, and it's ownable. Alternates if trademark search fails: *Sorted*,
*The Legacy Files*, *In Good Order*.

**Recurring segments** (each gets its own graphic treatment — see `PRODUCTION.md`):

1. **The Thing** — the weekly adviser client story (the core format, `SCRIPTS.md`).
2. **Score Stories** — people's Estate Score before/after (`ESTATE-SCORE.md`).
3. **33 Things** — the AI-explainer checklist series (`33-THINGS.md`).
4. **Ask an Estate Planner** — advisers answer one real question from comments/Reddit.

**Sign-off catchphrase** — every adviser ends every video with the same line:
> "Another family, sorted."

The catchphrase is the brand glue. Viewers finish the sentence before the adviser does
within a month. It also sets up the theme tune (below).

## 3. Content cadence (per week)

| Format | Who | Volume | Length |
|---|---|---|---|
| The Thing (client story) | 12 planners + 5 IFAs | 17 clips | 45–75s |
| 33 Things (AI explainer) | Automated / AI video | 3 clips | 30–45s |
| Score Stories | Rotating advisers + clients | 2 clips | 30–60s |
| Ask an Estate Planner | Rotating advisers | 2 clips | 45–60s |
| Compilation / best-of | Editor | 1 (long-form YouTube) | 5–8 min |

≈ 25 native posts/week; each clip is cross-posted to all short-form channels, so the
effective footprint is 100+ placements/week.

## 4. Channel plan

| Channel | What goes there | Notes |
|---|---|---|
| TikTok | Everything short-form | Firm account + each adviser posts to their own |
| Instagram Reels | Everything short-form | Same dual account model |
| YouTube Shorts | Everything short-form | Shorts feed the long-form channel |
| YouTube (long) | Weekly best-of episode, full 33 Things series | This is the "show" home; monetisable |
| Facebook Reels/Page | Everything + Score quiz posts | Older demographic = our buyers; expect FB to convert best |
| LinkedIn | Adviser personal profiles: their own story clip + text version | B2B referrals (accountants, solicitors) |
| Reddit | **Value-first only.** Advisers answer questions in r/UKPersonalFinance, r/inheritance, r/LegalAdviceUK with genuinely useful answers, disclosed flair, no links in comments. Monthly AMA once we have a following. | Reddit nukes marketers. Give value for 6 months; the brand searches follow. Never post clips as ads. |
| Wikipedia | **Not a channel.** You cannot post marketing to Wikipedia — promo pages get deleted and the domain gets flagged. The route is: earn press coverage (the Estate Score makes good consumer-press stories), and a page becomes viable once the firm is independently notable. | Park it; revisit after press hits. |
| Email | Weekly "best story of the week" + score nudge | List built by the Score quiz |

## 5. The lead engine: Estate Score

Every piece of content funnels to one conversion asset: the free 5-minute
**Estate Score** health check (full spec in `ESTATE-SCORE.md`). Score out of 1000,
credit-score mechanics, instant report, adviser follow-up. The CTA on every video is
soft and identical:

> "If you haven't checked your Estate Score, it's free and it takes five minutes —
> link's in the bio."

## 6. PPC plan

- **Search (highest intent):** "make a will", "lasting power of attorney", "estate
  planning near me", "inheritance tax advice", "put house in trust". Land on the
  matching service page (one page per 33-Things theme), with the Score quiz as the
  soft conversion for not-ready-yet visitors.
- **YouTube/Meta ads:** don't make ads — promote the organically best-performing
  clips (top 10% by watch-through). Organic is the creative testing lab; paid scales
  proven winners. Target 45+, homeowners, parents.
- **Remarketing:** everyone who starts the Score quiz but doesn't book gets the
  Score Stories clips as remarketing creative.
- **Measurement rule (learned the hard way on Calm & Contour):** a click is not a
  lead is not a booking. Track: quiz completions → booked consultations → signed
  clients, and compute cost per signed client weekly before scaling spend.

## 7. Web/SEO schema (get this right from day one)

Every page ships with JSON-LD:

- `Organization` + `logo` + `sameAs` (all social profiles) — sitewide.
- `FinancialService` / `LegalService` with `areaServed` — service pages.
- `Person` schema for each of the 17 advisers (own bio page: photo, credentials,
  their video embeds) — this is what makes advisers rank for their own names.
- `VideoObject` for every embedded clip (name, description, thumbnail, upload date,
  duration) — required for video rich results.
- `FAQPage` on every service page (mine the questions from Ask an Estate Planner).
- `HowTo` on the 33-Things article pages.
- `Quiz`/`WebApplication` markup on the Estate Score page.

Site structure: one pillar page per 33-Things theme (wills, LPA, trusts, IHT, digital
assets, funeral wishes…), each embedding the matching videos, each with FAQ schema —
so the videos rank in Google video results and the pages rank for the questions.

## 8. Theme tune & sonic brand

Yes to the theme tune — audio is the most under-used branding layer on short-form.

- **Sonic logo:** 3 notes sung/whistled on "Sor-ted" — plays under the end-card with
  the catchphrase on every single clip. This is the "Netflix ta-dum" move.
- **Theme (8–12s intro sting + 30s full):** warm, whistled/acoustic motif with light
  strings — homely, optimistic, zero corporate. Brief a composer or generate
  candidates with AI music tools (e.g. Suno) and A/B them on real clips.
- Register the final track properly (own the master) so it's cleared on every
  platform, and upload it as an "original sound" on TikTok/Reels so usage compounds
  to the brand.

## 9. Compliance (short, but non-negotiable)

- **Client stories are always anonymised and blended.** No names, no identifying
  details; change ages/locations/family shapes. The formula in `SCRIPTS.md` bakes
  this in. If a real client is on camera (Score Stories), signed release first.
- **IFA content is a financial promotion.** FCA rules apply: fair/clear/not
  misleading, no advice-like promises, firm name and required disclosures in the
  caption template, and every IFA clip passes compliance sign-off before posting —
  the approval step is built into the pipeline (`AUTOMATION.md`), so this costs no
  extra process.
- **Estate planner content:** follow STEP/SRA marketing codes as applicable; never
  guarantee tax outcomes ("can often save" not "will save").
- Never claim awards/rankings that aren't real (ad disapproval + false advertising).

## 10. 30-day rollout

**Week 1 — Foundations.** Lock show name + trademark search, Estate Score name and
scoring model, edit template designed (fonts/graphics/lower-thirds), Drive structure
created, 3 pilot advisers briefed with `PRODUCTION.md` + 3 scripts each.

**Week 2 — Pilot.** First 9 pilot clips filmed → edited via template → posted on firm
accounts. Iterate the template on real footage. Commission theme-tune candidates.
Estate Score quiz page built (questions in `ESTATE-SCORE.md`).

**Week 3 — Full fleet.** All 17 advisers onboarded (1-hour filming workshop, phone
rigs handed out), adviser social accounts created, first AI 33-Things clips live,
score quiz launched with schema.

**Week 4 — Automation + spend.** Make.com pipeline live (Drive → edit queue → approval
→ auto-post), weekly KPI report automated, first PPC behind the top 3 organic clips.

**KPIs (weekly):** raw clips in (target 17), published posts, views by channel,
watch-through %, profile visits, quiz starts, quiz completions, booked consultations,
signed clients, cost per signed client.
