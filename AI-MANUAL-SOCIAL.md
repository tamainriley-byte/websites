# Faceless AI content plan — Instagram + TikTok

Product: **The Open-Source AI Stack — A Plain-English Course.** 27 pages,
~6,700 words, 9 chapters + glossary. Teaches the seven open-source tools most
AI products are built on (vLLM, LangChain, LlamaIndex, Postgres + pgvector,
FastAPI, Playwright, Redis) — and fact-checks a viral Instagram carousel about
them, chapter by chapter.

_Written 14 Aug 2026. Revised after reading the course PDF._

---

## 0. Read this first: the pitch and the product don't match yet

The original brief for this content was: *understand AI · be the centre of
attention at dinner parties · build your own ChatGPT or Claude · build an
off-grid AI to protect you and your loved ones · use AI securely so nobody
steals your data.*

Against the actual manuscript:

| Promise | In the course? |
|---|---|
| Understand how AI products work, end to end | **Yes — this is the whole book.** Ch 0 and Ch 8 nail it. |
| Hold your own in any AI conversation | **Yes.** ~40 glossary terms, all in plain English. |
| Be the person at the dinner party | **Yes — literally a stated outcome** on the "before you start" page. |
| Build your own ChatGPT / Claude | **No.** No build steps. Ch 8's closing note suggests a tiny RAG app as a weekend project, with an AI assistant walking you through it. That's a signpost, not a build. |
| Off-grid AI, works without internet | **No.** Open-weight models and self-hosting get a few lines in Ch 1. Nothing on running one yourself. |
| Use AI securely, nobody steals your data | **No.** One passing clause about enterprises that can't send data outside. |

**Market the last three and you will get refunds and one-star reviews**, and
you'll have burned the ad account building an audience for a product that
isn't this one. Two options, and I'd take the first:

1. **Sell what the book actually is** — it's a sharper, more defensible
   position than the generic one (see §1). Add the missing three as a
   *second* product later; "Run AI on your own machine" is a great volume two
   and the audience this content builds is exactly who buys it.
2. Write the missing chapters first. That's real work — a local-model setup
   walkthrough, a data-security chapter — and it delays launch by weeks.

Everything below assumes option 1.

---

## 1. The position: not "learn AI" — "stop being bluffed about AI"

Ch 9, *How to read AI hype*, is the best chapter in the book and it should be
the front door of the whole brand. The book's real promise isn't "you'll
understand AI." It's:

> **You'll be able to read any confident AI post and know which half is true.**

Why this is the right position:

- **It's unoccupied.** "Learn AI in 2026" is the most saturated niche on both
  platforms. "The person who calls out AI nonsense, accurately, with the
  correction" is basically empty, because it requires actually knowing things.
- **It's native to the platform.** The book was written *about* an Instagram
  carousel. Your product's source material is the exact medium you're
  publishing into. That's a gift — the content writes itself and the
  self-reference is the joke.
- **It's an infinite content engine.** Viral AI posts are produced daily by
  other people, for free. Your recurring format is: take one, grade it. You
  will never run out and you never need to invent a topic.
- **It's shareable in a way "learn AI" isn't.** People don't share lessons.
  They share corrections, so they can send them to someone.
- **It skews B2B for free.** The buyer is the exec, founder, marketer or
  investor who keeps getting pitched "AI-powered" things and can't tell.
  That's a much better customer than "curious beginner."

Working account name candidates (check availability): **@plainenglishai ·
@thestackinplainenglish · @readtheai · @whattheystoldyou**. The line under the
handle: *"AI, fact-checked. No code, no hype."*

---

## 2. Format: real footage, and nothing that looks generated

Two rules, and the second one was learned the expensive way.

**No animated presenter.** A mascot host is a retention tax (viewers came for
the payoff), it costs 40–90 min per video against ~8 for the alternative, which
quietly drops you from 2 posts a day to 3 a week — the real reason faceless
pages fail. And a synthetic talking head reads as "AI slop" to precisely the
audience that has to believe you know your stuff.

**No generated visuals at all, as the spine.** We tried it — three style
rosters, generated illustration — and it failed on the thing that actually
decides reach:

> **The picture has to land the message. The text goes on top of it.** If the
> viewer has to work out what they're looking at, they've already scrolled.

Generated illustration pushes you toward *symbols* — a lattice standing for
meaning, a monolith standing for a sentence — and a symbol has to be decoded.
A login error, a terminal, a chat window is recognised instantly. That gap is
the whole difference between a stop and a scroll. On top of that, generated
animation reads as AI to exactly the audience you're asking to trust your
accuracy, which is a strange price to pay on a channel whose entire position is
"we're the accurate ones."

So the spine is **real capture**: screen recordings, hands, desks, your own
running product. Faceless is easy here — over-the-shoulder, hands on keys, and
the screen. No faces to film, no faces to get wrong.

**Where "animation" survives, honestly:** the course's analogies still need
pictures, but the picture should be a real artefact on a real screen, not an
illustration of the idea. A scatter plot of embeddings is far stronger footage
when a real model actually produced it and you filmed the terminal — it is a
diagram *and* it is evidence. `capture/embed_demo.py` in this repo does exactly
that, locally, on open weights, with no API key: the same open-source stack the
course is about, which is a nice piece of consistency for free.

The five identity constants are unchanged and still do the branding work: one
voice forever, one burned-in caption style, a static mark, a 0.6s cold-open
sting, one sign-off line.

**Identity, held rigid (this is what makes a faceless page feel like a brand):**
one voice forever · one burned-in caption style · a static mark used as
profile pic, corner watermark and 1.5s end card · a 0.6s cold-open sting · one
sign-off line, never changed. The voice *is* the character.

---

## 3. The four series

| Series | % | Length | Format | Job |
|---|---|---|---|---|
| **Reality check** | 35% | 20–35s | Screenshot of a claim + motion graphics correction | The signature. Identity + shares. |
| **Plain English** | 30% | 25–40s | Motion graphics analogy | Authority. One term, one picture. |
| **Under the bonnet** | 20% | 20–30s | Screen recording of a real AI product | Proof. See §4. |
| **Dinner party** | 15% | 20–30s | Mixed, offer-led | Conversion. |

**Reality check** is the flagship. Structure every one identically:

```
"Here's a claim you've seen." → show it →
"Here's the bit that's true." → "Here's the bit that isn't." →
"Here's how you'd have spotted it."
```

That last beat is the one that earns the follow — you're not just correcting,
you're handing over the detector.

**One rule, non-negotiable:** grade the *claim*, never the person. Blur
handles, don't show faces, never name the poster. The moment this becomes
dunking on an individual you get pile-ons, harassment reports and an audience
that came for blood instead of for the product.

---

## 4. Your unfair advantage: use Calm & Contour as the live specimen

The "Under the bonnet" series has a problem — you can't screen-record someone
else's stack. But you already run a real, live AI product: the Calm & Contour
site has an AI chat that captures leads, reads Google Calendar free/busy,
books appointments via a tool call, writes to Postgres, and notifies over
WhatsApp.

That is Ch 8's walkthrough running on a real business you own. Film it:

- The chat answering a real question → "that's the model. One component."
- The Postgres row appearing in /admin → "that's the archive."
- The calendar event being written → "that's a tool call. This is what people
  mean by 'agent'."
- The whole thing costing a fraction of a cent → the exact claim in Ch 8.

Nobody else in this niche can show a working product end to end. It also
proves the book's thesis better than the book does: *an AI product is mostly
not AI.*

---

## 5. Hook bank — all drawn from the actual manuscript

**Reality check**
1. "Anthropic. Perplexity. Together. Groq — all running vLLM." One of those four built its entire business on not using it.
2. That AI post you saved has four made-up numbers in it. Here's how to spot them in three seconds.
3. "The browser Claude uses." It isn't a browser. It doesn't browse. Here's what it actually is.
4. Whenever an AI post gives you a number with no source, mentally replace it with the word "lots." Watch what happens to the post.
5. "35,000 GitHub stars" is not proof of anything. A star is a bookmark. That's it.
6. "Pinecone raised $138M, pgvector is free — guess which one runs at scale." Both do. Here's the honest version.
7. In any list of impressive company names, check the biggest one. It's usually the shakiest.
8. This viral AI post is about 70% true. That's higher than most. Here's the 30%.

**Plain English**
9. AI doesn't search your documents by words. It searches by *coordinates*. Let me show you.
10. "How do I reset my password" and "I can't log into my account" share no words. To an AI they're almost the same point on a map.
11. Running an AI badly is a taxi rank. Running it well is a bus. That difference is why AI got cheap.
12. Everyone says "RAG" like you should know it. It's two words: search first, then answer.
13. There are two completely different things people call "using AI," and almost nobody knows which one they mean.
14. Your app has a filing cabinet and a whiteboard. Knowing which is which explains most of how software works.
15. An "agent" is not a smarter AI. It's the same AI in a loop, allowed to press buttons.

**Myth-busting (highest share rate — people send these)**
16. When a legal AI answers from your contracts, it was never trained on your contracts. Here's what actually happened.
17. No, it didn't "learn" your document. It read it once, answered, and forgot it immediately.
18. The AI startup charging you £50 a month per user is running free software. You're paying for polish — which is fine, but know what you're buying.
19. An AI product is mostly not AI. The model is one box out of seven.
20. Every "we built our own agent framework" pitch you've heard is usually a thin layer over something free.
21. That three-second AI answer cost the company a fraction of a penny.

**Story (these travel further than explainers)**
22. In 2024 a company took its free software private. Amazon and Google forked it out of spite. A year later they backed down. Here's what it tells you about "free forever."
23. The tool every AI browser agent is built on was made in 2020 to test websites. Nobody built it for AI.
24. One Italian programmer wrote the thing holding the memory of most AI apps. In 2009.
25. The clever bit that made AI cheap was borrowed from how your operating system manages memory.

**Dinner party / offer**
26. One sentence that will make you sound like you actually understand AI: "the model is one component."
27. By dinner tonight you'll be able to explain how an AI app works, end to end. It takes about 40 minutes to learn.
28. Next time someone pitches you "AI-powered," ask them this one question and watch their face.
29. You don't need to code. You need the map. It's about 40 minutes wide.

---

## 6. Three finished scripts

### 6.1 "The Groq tell" — Reality check, ~30s

```
[STING]

HOOK (screenshot of the claim, one line highlighted)
"Anthropic. Perplexity. Together. Groq — all running vLLM under the hood."

TURN
"Three of those are fine. The fourth one built its entire company
 on not doing that."

PROOF (motion graphics: four logos; Groq slides out; a custom chip animates in)
"Groq makes its own chips with its own software. That IS the pitch.
 And Anthropic runs its own models on its own systems — labs at that
 level always build their own.
 The true version: vLLM dominates open-weight model serving.
 The frontier labs mostly roll their own."

DETECTOR (the beat that earns the follow)
"Here's the trick. In any list of impressive names, check the biggest one.
 It's doing persuasion work, not information work — and it's almost always
 the one that doesn't hold up."

CTA
"Comment HYPE and I'll send you the checklist."
```

### 6.2 "GPS for meaning" — Plain English, ~35s

```
[STING]

HOOK (black screen, two sentences typing out side by side)
"'How do I reset my password.' 'I can't log into my account.'
 Not one word in common. To an AI, these are nearly the same thing.
 Here's how."

PROOF (motion graphics)
- Sentence one dissolves into a long row of numbers. "Every sentence gets
  turned into a list of numbers. Hundreds of them."
- The numbers collapse into a single dot landing on a map.
- Sentence two does the same — lands almost on top of it.
  "Similar meaning, similar numbers. It's GPS coordinates for meaning."
- A question drops onto the map; the nearest dots light up.
  "So searching stops being about matching words and becomes geometry.
   Find the nearest point."

PAYOFF
"That's why AI search can find the document that answers your question
 without containing a single one of your words. That's the whole trick
 behind every 'chat with your data' product you've ever seen."

CTA
"Comment MAP for the plain-English version of the rest of it."
```

### 6.3 "It was never trained on your data" — Myth-bust, ~28s

```
[STING]

HOOK (screen recording: a real chat answering a question about a document)
"People think this thing learned their document. It didn't.
 It read it once and forgot it instantly."

PROOF (motion graphics, then screen)
- A document → cut into chunks → chunks become dots on the map.
- A question arrives, five nearest chunks light up.
- Those five get pasted into a prompt, alongside the question.
  "Your file is found, copied into the question, and sent.
   The model answers from what's in front of it. Then it's gone.
   No training. Nothing learned. Nothing kept."

WHY IT MATTERS
"Which is worth knowing for two reasons. It's why these things can answer
 about a contract signed yesterday. And it's why 'is my data being trained
 on' is the wrong question to be asking."

CTA
"Comment RAG and I'll send you the breakdown."
```

---

## 7. Repackaging the product before you launch

Four changes, in priority order:

1. **Title.** "The Open-Source AI Stack" sells to people who already know what
   a stack is — i.e. not your buyer. The subtitle is the real title. Try:
   **"How AI Actually Works — and how to tell when someone's lying about it."**
2. **The time claim.** It's a ~40-minute read, not two hours. That's *better*
   — "one flight," "one commute," "shorter than a film." If you want the two
   hours honestly: the course's own closing chapter offers Route 2 (an hour
   looking at the real projects). Read + Route 2 = a defensible two hours.
   Say which is which.
3. **"Prepared for Terry · August 2026"** is on the cover. Change it before a
   single copy ships.
4. **The free lead magnet writes itself: Chapter 9.** It stands alone, it's the
   most shareable chapter, and it's the one that makes people want the rest.
   Give it away whole — teasing it would waste it.

**Volume two, already scoped by the gap in §0:** *Run AI on your own machine* —
local models, no internet, no company reading it. Every hook I wrote in the
first draft of this plan for the off-grid angle still applies, it just needs
the book to exist first. Sell it to this audience.

---

## 8. Accuracy is now the product

If the brand is "we're the accurate ones," being caught wrong once costs more
than fifty good videos earn. The manuscript's facts held up everywhere I
checked them — Playwright/Microsoft/2020, FastAPI/Sebastián Ramírez/2018,
Redis/Salvatore Sanfilippo/2009, the 2024 relicence → Valkey fork → 2025
reversal, PagedAttention out of UC Berkeley, Pinecone's raise. It's a well
sourced piece of work.

But some of it is volatile — LangChain's standing, who serves what, GitHub
star counts, "the current default." **Re-check any moving fact the week you
post about it**, and never quote a number you haven't seen a source for
yourself. That's the book's own Ch 9 rule; apply it to your own output first.

Corrections policy: if you get one wrong, post the correction *as a video*,
same format. That's on-brand, it outperforms the original, and it's the
cheapest trust you'll ever buy.

---

## 9. Cadence, production, funnel

**Cadence:** 2/day TikTok, 1–2/day IG Reels, 1 repost/day LinkedIn (same file,
different caption — LinkedIn is where the B2B buyer actually is, and it costs
you nothing). Minimum 60 days before judging anything.

**Batching:** one 3-hour session per week → 15–20 videos. Work in stages, not
video-by-video: write 20 hooks → build all the motion graphics from a locked
template → record all VO in one sitting (this is what keeps the voice
consistent) → assemble.

**Tools:** CapCut or After Effects for the diagrams · Descript or CapCut for
cuts and captions · ElevenLabs if not using your own voice · OBS for the
"Under the bonnet" screen captures. Higgsfield is connected in this repo's
environment (video/image/audio generation, shorts studio, direct TikTok
publishing) — useful for the sting, end card and the motion pieces.

**Funnel:**

```
video → comment keyword → ManyChat DM → Chapter 9 free → email sequence → course
```

The comment-keyword mechanic is the highest-converting thing on Instagram
right now: comments boost reach *and* capture the lead, so it pays twice. Soft
CTA from day one, paid course introduced around day 21.

---

## 10. Measurement

Judge after 30 videos, never after 5.

| Metric | Gate |
|---|---|
| 3-second retention | ≥ 50% — below this the hook is the problem, nothing else is |
| Average watch (sub-30s) | ≥ 60% |
| **Shares** per 1,000 views | the one that matters most for this position — corrections get *sent* |
| Follows per 1,000 views | ≥ 5 means the identity is landing |
| Email signups per 1,000 views | the only commercial number |

Kill a series after 10 videos if its median views sit below a third of the
account median. Double down on the top third.

---

## 11. First 14 days

- **Day 1** — decide §0: sell the book as it is (recommended) or write the
  missing chapters. Everything waits on this.
- **Day 1–2** — retitle, strip "Prepared for Terry", split Ch 9 out as the
  free lead magnet, set up email capture + ManyChat keywords (HYPE, MAP, RAG,
  STACK).
- **Day 2–3** — lock the five identity constants: voice, captions, mark,
  sting, sign-off. Build the motion-graphics template once, properly. Don't
  post until these exist.
- **Day 4–5** — batch 20 videos: 7 × Reality check, 6 × Plain English,
  4 × Under the bonnet (film the Calm & Contour chat), 3 × Dinner party.
  Use hooks 1, 3, 4, 5, 9, 10, 11, 16, 17, 19, 22, 23, 27.
- **Day 6** — start posting, 2/day, both platforms, same times daily.
- **Day 12** — first review: sort every video by 3-second retention. Rewrite
  the bottom five hooks, change nothing else. Batch the next 20.

The only failure mode that matters in the first 60 days is not posting enough
to learn anything. Protect the volume above everything else — which is, in the
end, the real argument against the animated character.
