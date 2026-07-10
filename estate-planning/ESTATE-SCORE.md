# ESTATE-SCORE.md — The Free Health Check (the lead engine)

Every video points at one thing: a free, 5-minute health check of your legal and
financial affairs that gives you a score out of 1000. Credit-score mechanics, but for
whether your life is *sorted*.

---

## 1. The name

**Recommended: "Estate Score"** — say it exactly how people will say it:

> "Have you checked your **Estate Score**? It's this free health check of your legal
> and financial affairs — takes five minutes — so you know if there's anything you
> need to sort. I was at 300. I'm at 850 now. That's fine for where I am — when I'm
> older I'll bump it up towards 1000. Honestly, I feel so relaxed now it's all
> sorted."

Why it wins: two words, says exactly what it measures, sounds like "credit score" (a
mechanic everyone already understands), and it's ownable — nobody in the space has
claimed it. Trademark it early.

Shortlist alternates (if the trademark search fails):
- **Sorted Score** — warmer, pairs with the catchphrase, slightly less category-defining.
- **Legacy Score** — grander, but "legacy" skews old and posh.
- **Life Admin Score** — relatable, but undersells the stakes.

## 2. The scoring model — 1000 points, 5 pillars × 200

| Pillar | Covers | Points |
|---|---|---|
| **Will & Wishes** | Valid up-to-date will, expression of wishes, funeral wishes, letters | 200 |
| **Protection** | Lasting powers of attorney (both types), guardianship for minors, life cover in trust | 200 |
| **Money** | Pensions found + nominations done, savings/ISA organisation, emergency fund, retirement plan exists | 200 |
| **Tax & Estate** | IHT exposure understood, gifting allowances used, property/trust structure reviewed | 200 |
| **Modern Life** | Digital assets & passwords plan, subscriptions/accounts list, business succession if applicable, family knows where everything is | 200 |

~25 yes/no/partly questions (5 per pillar, ~5 minutes). Every question maps to a
service we offer — the report is the sales conversation, done politely by a PDF.

### Score bands (these names appear on the gauge graphic)

| Band | Score | On-screen label |
|---|---|---|
| 0–299 | Red | **Exposed** — "if something happened tomorrow, your family would be guessing" |
| 300–549 | Amber | **Started** — "you've begun, big gaps remain" |
| 550–749 | Yellow-green | **Solid** — "the essentials are in place" |
| 750–899 | Green | **Sorted** — "you can relax; review yearly" |
| 900–1000 | Gold | **Gold** — "everything handled, nothing left to guess" |

### Life-stage targets (the retention mechanic)
The report never says "get 1000". It gives a target for your stage — exactly the
"850 is fine for now, I'll bump it up later" behaviour we want, because it means
people **retake the quiz for years**:

- Under 40, no kids: target 550+
- Parents of minors: target 750+ (guardianship + LPAs are non-negotiable)
- 55–70: target 850+
- 70+ or business owners: target 900+

Annual re-score email: "It's been a year — has life changed? Re-check your Estate
Score (5 mins)." Score drops automatically if the will is now >5 years old — a
built-in reason to come back.

## 3. The funnel

1. Video CTA → `/estate-score` landing page (Quiz schema, one field to start: nothing).
2. 25 questions, progress bar, band revealed with an animated gauge (the shareable
   moment — "screenshot your score" prompt).
3. Email required to get the full PDF report (per-pillar breakdown + "your 3 quickest
   wins" + book-a-call button routed to an adviser).
4. Nurture: score-band-specific email sequence + Score Stories clips as remarketing.
5. Adviser follow-up call for red/amber bands who ticked "happy to be contacted".

**Honesty rule:** the score is a genuine self-assessment, not a scare tactic. Someone
genuinely sorted should score Sorted and be told "you're fine, see you next year."
That's what makes it shareable and press-worthy instead of slimy.

## 4. Score scripts (for advisers and for real clients on camera — signed release)

**SS-01 — Adviser explains it (evergreen)**
"People ask what an Estate Score is, so — quick version. It's a free health check of
your legal and financial affairs. Twenty-five questions, five minutes, and you get a
score out of 1000, like a credit score, but for whether your life is actually
sorted. Will, powers of attorney, pensions, tax, even your passwords and photos.
Most people's first score is under 400 — not because they're careless, just because
nobody ever showed them the list. Link's in the bio. Takes five minutes. Another
family, sorted."

**SS-02 — The "I was at 300" testimonial (the flagship — real client or adviser's own)**
"Have you checked your Estate Score? Genuinely — I did it myself before I'd ever ask
a client to. I was at 300. Three hundred! And I *do this for a living*'s cousin —
no will update in nine years, no power of attorney, pensions everywhere. I'm at 850
now. That's fine for where I am; when I'm older I'll bump it up towards 1000. But
honestly — I feel so relaxed now it's all sorted. Five minutes. Do it."

**SS-03 — The couple who competed**
"Best Estate Score story so far: a couple did the quiz on the sofa, separately, and
turned it into a competition. He got 410, she got 520, and neither of them could
stand it — so they booked in and sorted the lot. They're both Gold now, and yes,
they compared certificates. Whatever gets you there. Five minutes, link in bio."

**SS-04 — Parents of young kids**
"If you've got young kids, here's the only Estate Score question that matters:
who takes care of them if the worst happens — and is it written down anywhere? If
your stomach just dropped, that's what the score is for. Five minutes, it shows you
exactly what's missing and what's fine. Most parents' first score stings a bit.
Fixing it takes one afternoon. Another family, sorted."

**SS-05 — The retake**
"Little update — remember I said I was at 850 and that was fine for now? Life
changed. New grandchild. So I retook my Estate Score, updated the will, added her
in, redid a couple of nominations — 920. The point of the score isn't the number.
It's that when life changes, you know exactly what to touch. Five minutes, once a
year. That's the whole system."

**SS-06 — The parent test (gentle, powerful)**
"Hardest and kindest thing you can do this week: get your mum or dad to do their
Estate Score with you. Five minutes, cup of tea. Either it comes back green and
everyone relaxes — or it shows you, gently, what needs sorting while it's easy to
sort. Both of those are a gift. Link's in the bio."

## 5. Build notes

- Landing page `/estate-score`: quiz UI, animated gauge result, band share-card
  (auto-generated image with score + band for socials), `Quiz` + `FAQPage` schema.
- Store: email, answers, score, band, life stage, consent flags → CRM; route
  red/amber + consent to adviser round-robin.
- The gauge animation asset doubles as the graphics package's signature "wow"
  element in videos (see PRODUCTION.md).
- Press angle (earns the coverage that Wikipedia/notability needs): "The average
  Brit's Estate Score is 340/1000" — run the aggregate numbers quarterly and pitch
  them to consumer money pages.
