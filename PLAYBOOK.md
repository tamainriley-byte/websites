# The Local-Service Lead Machine — Playbook

How Calm & Contour (VIP mobile massage, Mallorca) was turned into an automated
lead-capture and booking machine, written so the whole thing can be replicated
for any local service business — a new city, a new trade, a new brand. Copy,
rename, launch.

_What's marked ✅ is live and proven here. What's marked 🔜 is designed but not
yet executed here — do it at the new business from day one._

---

## 0. The model in one line

**Paid search → keyword-matched landing page → on-site AI chat with a number
gate → AI books into a real calendar → owner pinged on WhatsApp → daily
cost-per-booking email decides whether to scale.**

Everything below exists to serve that line. The whole stack costs almost
nothing until it's earning: hosting free (Vercel Hobby), database free (Neon),
AI ~pennies per chat (Claude Haiku), notifications free (CallMeBot), email
free (Resend). The only real spend is the ad budget.

**The economics gate (the most important rule):** know your margin per job
(here ~€35). The daily report computes rolling 7-day cost per booking. Under
the margin → SCALE (raise budget ~20%). Near it → HOLD. Over it → CUT and fix
the funnel first. No feature gets built and no budget gets raised while cost
per booking is upside down. This one number also decides when to hire and
when to open the next city.

---

## 1. The stack (copy-paste)

| Piece | Choice | Why |
|---|---|---|
| Site | Next.js App Router + Tailwind, deployed on Vercel | push-to-main = live in ~1 min |
| DB | Neon Postgres (free tier), schema auto-creates on first request | zero migration ceremony |
| AI chat | Claude (`claude-haiku-4-5`) via raw fetch, ~500 max tokens | cheap, fast, good enough to sell |
| Booking | Google Calendar API (free) — OAuth once, freeBusy + event insert | the owner's real diary is the source of truth |
| Owner alerts | CallMeBot WhatsApp bridge (free) | good enough for nudges; NOT reliable (see pitfalls) |
| Reports | Resend (free tier) + Vercel Cron daily | the economics email |
| Analytics | Vercel Analytics + Google Ads gtag only | add MS Clarity when you care about session replays |

Env vars that make it run: `ANTHROPIC_API_KEY`, `DATABASE_URL`,
`<OWNER>_WHATSAPP` + `CALLMEBOT_APIKEY`, `GOOGLE_CLIENT_ID/SECRET` (calendar),
`RESEND_API_KEY`, `ADS_DAILY_BUDGET_EUR`, optional `PAYMENT_LINK_URL`,
`GOOGLE_REVIEW_URL`. Every env change needs a redeploy.

---

## 2. The funnel rules (each one was learned the hard way)

1. ✅ **Every CTA opens the on-site chat.** No button goes straight out to
   WhatsApp/phone — leaving the site = an uncaptured lead you'll never see
   again. (Caveat: only intercept once the chat genuinely works. We
   intercepted while the bot was broken and leads went from 3/day to zero.)
2. ✅ **Number gate before chat.** The chat's one composer starts as a
   phone field (`type=tel autocomplete=tel` → the phone offers its own number,
   one tap) and only becomes a message box after a valid number (7–15 digits)
   is saved. Every chatter is a captured lead *before* the conversation.
   Capture rate observed: ~2 of 3 chat openers leave their number.
3. ✅ **The AI speaks as the owner, trained on their real messages.** Feed
   the system prompt 10–20 of the owner's actual WhatsApp replies and their
   intake form. Rules that matter: never admits being AI, answers questions
   before asking for anything, one question at a time, suggests the premium
   option (come-to-you) first, never uses prices/facts not in the prompt.
4. ✅ **Real availability, real bookings.** Inject the owner's next-7-days
   free slots (Google Calendar freeBusy) into the prompt; give the model ONE
   tool: `book_appointment`. Event lands in the diary, lead auto-marked
   booked, owner WhatsApp'd.
5. ✅ **Never trust the model's claims — verify with a tripwire.** Our bot
   once told a client "you're booked" without calling the tool. Fixes: prompt
   rule (a booking only exists after a BOOKED tool result) + server-side regex
   scan of replies for booked-claim language (EN+ES) when the tool went
   unused → instant "⚠️ check the diary" WhatsApp to the owner.
6. ✅ **Transcript on exit.** `pagehide` beacon + a 15-minute cold sweep:
   when the visitor leaves or goes quiet, the owner gets the full transcript
   once — "They've left the chat 📞 Call this lead now." Speed-to-call is the
   whole game with warm leads.
7. ✅ **The admin inbox is the CRM.** Every chat card carries: status chip
   (New → Booked ✓ → Shown ✓), reply-as-owner box, mute-AI takeover, one-tap
   WhatsApp buttons (confirmation with real booking details, reschedule,
   payment request, review ask), and paste-to-book (paste a WhatsApp convo,
   AI extracts date/time/treatment/place into the booking form).
8. ✅ **Service area is enforced in three places** — chat prompt, page copy,
   and ads geo-targeting — or leads leak in from places you can't serve (we
   got a lead from a different island).

---

## 3. Google Ads method

1. ✅ **One ad group per service page, mapped 1:1.** The searcher's words
   appear in the keyword, the headline, AND the landing page H1. This is what
   Quality Score measures (expected CTR / ad relevance / landing page
   experience). Our generic catch-all group scored 1/10 and was "rarely
   shown"; the fix is this mapping, not more budget.
2. ✅ **Broad match inside tightly themed groups + a fat shared negative
   list** (jobs, courses, cheap, chairs/guns/devices, adult terms, and every
   out-of-area town). Exact-match money phrases get "Low search volume" in a
   niche — broad+negatives is how you actually serve.
3. ✅ **Town keywords → town pages.** `massage magaluf` lands on
   /massage-magaluf, not the homepage. Use `{KeyWord:…}` insertion so the ad
   headline echoes the exact town typed.
4. ✅ **Geo: target the service area only, "Presence" not
   "Presence or interest".** Google's default shows your ads to people merely
   *interested* in the area — that's how a Menorca resident cost us a click.
5. ✅ **A conversion = a captured lead (number saved), never a click.**
   We fired conversions on button clicks first; Google reported 3 when the
   app had 2 real leads, and it optimises toward the wrong thing. Fire the
   gtag event only when the phone number saves. Counting = "One" per click.
6. ✅ **Bid Maximize Clicks until 15+ conversions/30 days, then Maximize
   Conversions.** Structure first, smart bidding second.
7. ✅ **Kill low-intent campaign types.** Demand Gen brought callers who hung
   up. High-intent Search converts ~10× better for "need it now" services.
8. ✅ **Mine the search-terms report weekly** — it told us people search
   "massage + town", which drove the whole town-page strategy.

---

## 4. Local SEO

1. ✅ **Technical floor:** sitemap.xml, robots.txt (block /admin, /api),
   metadataBase/canonicals, JSON-LD (`MassageService`/local business schema
   with address, areaServed, offers) on every page. Submit sitemap in Search
   Console.
2. ✅ **A page per service and a page per town**, each with genuinely local
   copy (the hotel strip, the marina, the golf courses, the cycling season —
   details only a local would write), local FAQs, and the same booking CTA.
   Never clone a page and swap the town name — thin doorway pages get filtered.
3. ✅ **The review engine IS the local SEO engine.** Map-pack ranking is
   driven by review count/recency/rating more than anything on your site.
   Flow: client marked "Shown" in admin → one-tap WhatsApp: review link +
   offer (here: €5 off for a review, €15 for a referral, €20 for both).
   ⚠️ Google policy bans incentivised reviews — the compliant version asks
   plainly and gives the discount afterwards as a surprise thank-you. Owner's
   risk call.
4. 🔜 **Google Business Profile hygiene:** current prices, fresh photos,
   weekly posts, Q&A seeded, services listed. Free ranking juice most
   businesses ignore.
5. 🔜 **Blog migration at the exact old URLs** if the business had one —
   moving domains/platforms loses rankings unless URLs are preserved or 301'd.

---

## 5. LLM / AI-search ranking (the "Reddit trick") 🔜

Growing share of "best massage in mallorca" answers now come from ChatGPT,
Claude and Perplexity — and those answers are shaped by the sources models
read and cite: **Reddit threads, Tripadvisor forums, "best of" listicles, and
structured data.** The tactic:

1. Find the threads that already rank ("best massage Mallorca reddit",
   r/Mallorca, r/travel, Tripadvisor forum): these are what LLMs quote.
2. Get mentioned in them **authentically** — answer questions helpfully as
   the owner (declare the affiliation), and let happy clients post their
   experience organically (ask them, same moment as the review ask).
   ⚠️ Never astroturf/fake reviews — subreddit bans + brand damage + it's
   detectable. And never claim "voted best on Reddit" in ads unless literally
   true (ad disapproval + false advertising).
3. Feed the machines structured facts: JSON-LD on every page, consistent
   NAP (name/address/phone) everywhere, an FAQ section per page — LLM
   crawlers eat FAQs.
4. Perplexity and ChatGPT cite pages directly — the town/service pages with
   clear pricing tables are exactly what gets cited. Keep prices honest and
   current on-page.

---

## 6. Pricing method

1. ✅ **Anchor on a per-minute rate** (here studio = €1.50/min) → a clean
   ladder (60/90/120 = €90/€135/€180) that the AI can recite without errors.
2. ✅ **Mobile premium as a flat-ish uplift** that shrinks at longer
   durations (€130/€155/€180) — nudges clients toward longer bookings.
3. ✅ **A named VIP tier ~10% above the top rung** ("The Ritual", 2h €200,
   only €20 over a plain 2h) — captures "money on the table" clients and
   gives the AI an upsell script. Make rituals/packages a *tier*, not a
   per-duration menu — one length, one price, sold as a ceremony.
4. ✅ **Kill offerings you can't deliver** (couples needed a second
   therapist → removed everywhere same day, replaced with honest
   back-to-back). An AI that promises what you can't do costs more than the
   booking was worth.

---

## 7. Payments (sequence matters)

1. **First: legal merchant status.** Card processors (Stripe/SumUp/Wise) all
   KYC the merchant and report income to the tax authority. In Spain that
   means autónomo or a company — sort this before switching payments on.
2. **Interim (built ✅):** `PAYMENT_LINK_URL` env — any provider's hosted
   payment link powers a one-tap "Request payment" WhatsApp from admin and
   rides along in the booking confirmation.
3. **In person:** SumUp / Stripe Tap to Pay — the phone is the card machine.
4. **Platform phase:** Stripe only (SetupIntent card-on-file, deposits,
   Connect for multi-therapist payouts). Wise is the cheap *bank* payouts
   land in, never the processor. Never store card numbers yourself.

---

## 8. Replication checklist for a new city / business

Day 1–2: clone repo, rebrand (name, photos, palette), rewrite the AI prompt
with the new owner's real messages + intake form + service area + price
ladder. New Neon DB, new Vercel project, domain.
Day 2–3: Google Calendar OAuth connect. CallMeBot activation for the owner's
number. Send a test chat end-to-end: number gate → AI → booking lands in
calendar → owner pinged → confirmation button works.
Day 3–5: write service pages + town pages for the *actual* service area
(presence-targeted). Sitemap → Search Console. Google Business Profile
claimed, prices + photos loaded.
Day 5–7: Google Ads: themed groups 1:1 with pages, broad match + negative
list, geo presence-only, conversion = lead capture (counting One), Maximize
Clicks, ~€25/day.
Week 2: activate the daily report (Resend). Watch cost per lead → cost per
booking daily. Review engine on from the first happy client (mark Shown →
ask). Iterate ad negatives from the search-terms report.
Gate everything on the €-margin rule (section 0).

---

## 9. Pitfalls — the war stories (read before touching anything)

1. **Retired AI model = silent death.** The chat's model ID was deprecated;
   the API 404'd and the code fell back to canned keyword replies for weeks.
   Nobody noticed; leads rotted. If the bot ever "goes robotic", check the
   model ID first. Pin current IDs; log fallbacks loudly.
2. **Click-conversions poison everything** — inflate results, mistrain smart
   bidding, and hide funnel breaks. Conversion = captured lead, full stop.
3. **Intercepting CTAs while the bot is broken kills the business** —
   3 leads/day → 0 overnight. The funnel is only as strong as its weakest
   hop; change one hop at a time and watch the daily count.
4. **The model will claim actions it didn't take.** Belt (prompt rule) +
   braces (server-side tripwire + owner alert). Applies to any tool-using
   agent that talks to customers.
5. **Free notification bridges drop messages.** CallMeBot is a nudge, not a
   system of record. The calendar event and the admin inbox are the truth;
   WhatsApp pings are a convenience layer.
6. **Env var changes do nothing until redeploy** (Vercel). Case-sensitive
   names. "Sensitive" vars can't be edited — delete and recreate.
7. **Geo leaks are silent budget burn** — default ad targeting includes
   "interested in", service pages listing towns you don't serve invite leads
   you must refuse. Enforce the area in copy, prompt AND targeting.
8. **Don't compare metrics across a definition change** (our conversions
   before/after 12 Jul mean different things). Annotate the date, start a
   new baseline.
9. **Google reviews for discounts violates policy** — do it knowingly or do
   the compliant variant (ask plainly, thank with the discount after).
10. **One funnel, one owner decision log.** Every "why is it like this?" has
    an owner decision and a date in CLAUDE.md. Keep that file the single
    source of truth — it's what lets any AI session (or human) pick the
    business up cold.

---

## 10. What this playbook produced here (proof)

- Broken robotic chat → natural AI in the owner's voice, booking real
  appointments into her calendar unattended (including full conversations in
  Spanish, ending in a written confirmation with address).
- ~3 leads/day on €25/day = €8–12 per captured lead, pre-optimisation.
- 67% of chat openers leave their mobile number.
- Every lead reaches the owner's phone in seconds with the full transcript,
  and no client can silently fall through the calendar gap.
- The whole machine runs on ~€0/month fixed costs + ad spend.
