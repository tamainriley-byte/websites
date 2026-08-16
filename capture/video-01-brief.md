# Video 01 — "Two sentences, no shared words"

Series: **Plain English** · 30 seconds · 9:16 · captions on · voice: Mark

Real footage only. Nothing in this film is generated, which is the point — the
channel's position is "we're the accurate ones," and generated visuals undercut
that before a word is spoken.

---

## The rule this is built on

**The picture lands the message. The text goes on top of it.** If a viewer has
to work out what they are looking at, they have already scrolled. Every shot
below is a thing a person recognises instantly — a login screen, a terminal, a
chat window — not a symbol standing in for an idea.

---

## Narration (already recorded, voice: Mark)

| # | Line | Take |
|---|---|---|
| 1 | "Two sentences, not one shared word. How do I reset my password and I cannot log into my account land in almost the same place inside every AI search." | 8.76s |
| 2 | "Every sentence becomes a long list of numbers, hundreds of them, and that list is really a coordinate. Two ideas that mean the same thing land on almost identical numbers." | 8.64s |
| 3 | "So searching stops being about matching words and becomes geometry: find the nearest point. That is how it finds the document that answers you without containing a single word you typed." | 8.76s |

All three read fast (~3.4 words/sec) because they were paced for a fixed
10-second block. On a real-footage cut the block is gone, so they should be
re-recorded with more room before use — same words, slower delivery.

---

## Shot list

Everything is a screen recording or a desk shot. **No faces** — hands, over the
shoulder, and the screen. That keeps it faceless and removes the hardest thing
to film well.

### Beat 1 — the hook (0:00–0:09)

| Shot | Length | What to capture |
|---|---|---|
| 1.1 | 2s | Over-the-shoulder, real laptop: a failed login. Type the wrong password, let the red error appear. Film the error landing, not the typing. |
| 1.2 | 2s | Straight-on screen: a support box, type `how do I reset my password` and stop. Cursor blinking. |
| 1.3 | 2s | Same framing, different tab: type `I can't log into my account` and stop. |
| 1.4 | 3s | Both phrases side by side (split screen in the edit). Hold. |

Text on top, in sequence: **"Same problem."** → **"Not one word in common."**

The two phrases side by side *are* the hook. A viewer gets it before the
narration finishes the first sentence, which is exactly right.

### Beat 2 — the turn (0:09–0:18)

Run `python3 embed_demo.py numbers` (see `embed_demo.py` in this folder — it
runs a real open-weight model locally, no API key, nothing leaves the machine).

| Shot | Length | What to capture |
|---|---|---|
| 2.1 | 3s | Terminal full screen: the first sentence, then the wall of numbers flooding out under it. |
| 2.2 | 2s | Same for the second sentence. |
| 2.3 | 4s | `python3 embed_demo.py compare` — "words in common: 0", then "closeness in meaning: 0.7-something". Hold on the two numbers together. |

Text on top: **"Every sentence becomes numbers."**

Shot 2.3 is the single most valuable frame in the film. Zero words shared, high
closeness, both on screen at once, from a real model. Nobody can argue with it.

### Beat 3 — the payoff (0:18–0:30)

| Shot | Length | What to capture |
|---|---|---|
| 3.1 | 4s | `python3 embed_demo.py map` → film `meaning_map.png` on screen, slow push in. Three visible clusters, white query dot, five coral neighbours lit. |
| 3.2 | 5s | **Your own product.** Open the Calm & Contour chat and ask something using words that appear nowhere on the site — "can someone come to the boat?" — and let it answer correctly about yacht visits. Film the whole exchange uncut. |
| 3.3 | 3s | End card. |

Text on top: **"It found it without your words."**

Shot 3.2 is the one nobody else in this niche can film. It is a working AI
product, yours, answering correctly from words that do not appear in its
source. That is the entire thesis of the video demonstrated on a real business.

---

## Terminal setup (for shots 2.x)

Do this once and every future "Watch this" video inherits it:

- Dark background `#0d1117`, one accent colour, no rainbow themes.
- Font 18–20pt. Filmed vertically, so lines must be short — keep the window
  narrow rather than shrinking the text.
- Hide the shell prompt path (`PS1='$ '`). A visible home directory is noise
  and occasionally a privacy leak.
- Screen recording at 60fps if the machine allows; text scrolling at 30fps
  strobes.

## Edit spec

- Cut to the voice, not to a grid. The narration is the clock.
- Hard cuts only. No dissolves, no zoom transitions.
- Captions burned in, one identity style, bottom ~12%, never over the terminal
  output — move them to the top third during shots 2.1–2.3.
- Sound: keep real key clicks and the UI sounds. No music bed.
- The end card and sting are still to be built — they are brand assets, not
  part of this film, and they need to be made once and reused forever.

## What is still open

1. **Re-record the three narration takes** with more room (they currently rush).
2. **Build the sting and end card** — one time, then reused on every video.
3. **Decide the caption look** and lock it; it is one of the five identity
   constants and it should never change after video 01.
