# PRODUCTION.md — Filming, the Edit Template, and the Drive

The whole system stands on two things: advisers can film a usable clip in under 15
minutes with zero kit anxiety, and every clip that comes out the other end looks like
the same show. This doc is both halves.

---

## 1. Adviser filming guide (print this, one page, give to all 17)

**The setup**
- Your phone, **vertical (9:16)**, front camera is fine.
- POV handheld, arm's length or a small tripod on your desk/dashboard/kitchen counter.
- Face a window (light on your face, never behind you). No ring lights needed — 
  natural and slightly imperfect IS the style.
- Quiet room or parked car. Wired earphones mic if you have one; phone mic is fine.
- Wear what you wore to the meeting. This is real life, not an ad.

**The take**
- Open the notes app version of your script, read it twice, then put it down.
  **Talk it, don't read it.** Like a voice note to a friend.
- Look at the lens, not the screen.
- Leave **3 seconds of silence** at the start and end (the edit needs it).
- One or two takes max. The first take is nearly always the keeper. If you fluff a
  line, pause 2 seconds and just say that sentence again — the editor cuts it.
- Always end with the sign-off: **"Another family, sorted."**
- 45–75 seconds. If you hit 2 minutes, it's two stories — save one for next week.

**The rules that keep us out of trouble**
- No client names, no identifying details, blend the facts (see SCRIPTS.md).
- No numbers as promises ("can often save tax", never "will save you £X").
- IFAs: your clip is a financial promotion — it will not post until compliance
  sign-off (built into the pipeline; costs you nothing extra).

**The upload (2 minutes)**
1. Open the shared Drive → your folder inside `01-INBOX`.
2. Upload the video.
3. Name it: `YYYY-MM-DD_yourname_slug.mp4` (e.g. `2026-07-14_sarah_quarterly-meal.mp4`).
4. Fill the row in the Content Sheet (auto-linked in the folder): script ref, one-line
   summary, anonymisation check ✅, and for IFAs the compliance checkbox.
Done. You'll get a link to the finished edit for approval before it posts anywhere.

## 2. Google Drive structure

```
/Content Engine
  /00-BRIEFS            scripts assigned this week (one doc per adviser)
  /01-INBOX             raw uploads — one subfolder per adviser (17)
  /02-EDITING           editor working folder
  /03-REVIEW            finished edits awaiting adviser + compliance approval
  /04-APPROVED          approved masters — the auto-poster watches THIS folder
  /05-POSTED            archive, auto-moved after publishing (files renamed with post date)
  /06-ASSETS            template project files, fonts, stings, music, gauge animation,
                        lower-third graphics, end cards, logo pack
  /07-AI-SERIES         33 Things + other AI-generated clips (same review flow)
  Content Sheet         the master tracker (one row per clip, status column drives everything)
```

Status column values: `RAW → EDITING → REVIEW → APPROVED → POSTED`. The automation
(AUTOMATION.md) is driven entirely by folder moves + this sheet, so a human can always
see and override everything.

## 3. The edit template ("the show look")

Goal: real-estate-show polish on UGC footage. Every clip, same skeleton, so editing is
assembly, not design. Build once as a CapCut/Premiere/Descript template in `06-ASSETS`.

**The skeleton (for a 60s Client Story):**

| Time | Element |
|---|---|
| 0.0–0.5s | Cold open — first words already playing (no logos first; hooks die in 1s) |
| 0.5–3s | **Hook text** slams on screen, big kinetic type, 2–4 words from the story ("SHE WAS AT 300" / "THE THING WAS…") |
| 3–6s | **Lower third** slides in: `SARAH · Estate Planner · 14 years` + show wordmark, real-estate-show style |
| Throughout | Auto-captions, word-by-word highlight, our font/colours; key phrases pop to 1.5× with colour |
| At "the thing was…" | The signature graphic moment: subtle push-in + music swell + "THE THING" sting graphic — the show's trademark beat |
| Story-specific | ONE big wow graphic per clip max (map pin, animated calendar for the quarterly meal, gauge for Score clips, floating letter for EP-02 style) — templated, editor picks from the kit |
| Last 3s | End card: "Another family, sorted." + sonic logo + "Estate Score — free, 5 mins — link in bio" |

**Design system (lock these in `06-ASSETS` and never improvise):**
- Fonts: one display font for the big kinetic words, one clean sans for captions
  and lower thirds. Licensed for commercial + social use.
- Colours: 3 brand colours + the 5 score-band colours (red/amber/yellow-green/green/gold)
  used ONLY for score content, so the bands become recognisable.
- Motion: everything eases the same way (same in/out curves). Lower thirds always
  from the left. Wow graphics always centre-screen.
- Sound: theme sting on the end card of every clip; captions on; music bed at -20dB
  under speech, from a cleared library or our own theme variations.
- Per-adviser: each of the 17 gets a saved lower-third preset (name, role, years) —
  editor never retypes.

**Wow graphics kit (build these 10 once, reuse forever):**
score gauge animation · animated calendar/"every quarter" loop · sealed letter
opening · family-table filling with people · map pin + route · rising/falling
tax-coin stack (generic, no figures) · house with a heart · pen signing a document ·
"№ x/33" number card · before/after score flip card.

**Variants exported per clip:** 9:16 master (TikTok/Reels/Shorts/FB), 1:1 (feed),
16:9 (YouTube long-form b-roll). Auto-reframe from the 9:16 master.

## 4. Editing ops

- **Target: ≤48h from raw upload to REVIEW.** One editor can do 25 templated clips/week
  once the kit exists; start with a freelancer at ~2h/clip, falling to ~40min.
- Editor workflow: pull from `01-INBOX` → template project → captions auto-generated
  then human-checked (names, jargon) → hook text chosen from the strongest line →
  one wow graphic → export variants → drop in `03-REVIEW` → status to REVIEW.
- Caption copy (the text under the post) is drafted by AI from the transcript in the
  adviser's voice + 3 hashtags + the Score CTA, saved next to the video, approved in
  the same review step.
- **AI-assist option to cut cost later:** auto-captioning + template assembly via
  tools like Descript/Submagic/Opus-style pipelines; keep the human pass for the hook
  choice and the graphic — that's where the taste lives.

## 5. The weekly rhythm

- **Mon:** 15-min content call — each adviser pitches their "thing" in one sentence;
  briefs land in `00-BRIEFS`.
- **Tue–Thu:** advisers film + upload (15 min each).
- **Rolling:** edits out within 48h; adviser approves from their phone (thumbs-up on
  the review link); compliance signs off IFA clips in the same step.
- **Fri:** next week's posting queue locked; best-of clip chosen for the YouTube
  long-form cut.
