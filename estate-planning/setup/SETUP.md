# SETUP.md — stand the whole engine up (about 1 hour of clicks, in order)

## Already live (done for you)

- ✅ Google Drive: **"Content Engine"** folder created in tamainriley@gmail.com's Drive
  → https://drive.google.com/drive/folders/1sE8SXHJvhYXZlAmj6JJhyQ7NQY4k4Js3
  with `00-BRIEFS` inside it.
- ✅ This repo: full playbook (`estate-planning/`) — scripts, score, production, automation.

## Step 1 — Finish the Drive in one click (2 min)

Run `drive-setup.gs` (in this folder) at https://script.google.com — full instructions
in the file header. It builds the remaining folders, all 17 adviser upload folders,
the **Content Sheet** tracker (with status colours + dropdowns + compliance
checkboxes) and the **Filming Guide** doc. It's idempotent: it will detect the
existing folders and never duplicate.

Then: rename the 17 folders in `01-INBOX` to real adviser names, share each adviser
their own folder + the sheet, share the whole tree with the editor.

## Step 2 — Make.com scenarios (30–45 min)

Build the four scenarios exactly as written in `MAKE-SCENARIOS.md` under
shannon@tab-legal.com. Switch on A (intake) immediately; B/C/D as the pilot flows.

## Step 3 — The edit template (editor's job, half a day, once)

Follow `../PRODUCTION.md` §3: build the CapCut (or Premiere/Descript) template with
the skeleton, fonts, lower-thirds and the 10-piece wow-graphics kit; save the project
files into `06-ASSETS`. Every clip after that is assembly, not design.

## Step 4 — Scheduler account (15 min + card)

Pick **Metricool** (cheaper, good API) or **Blotato** (built for this exact
multi-profile clip fan-out). Connect: firm TikTok, IG, YouTube, Facebook + adviser
profiles as they come online. Then swap Scenario C's email module for the API call.

## Step 5 — AI videos (33 Things series)

Two routes, both fine:
- **HeyGen** — the connector is already added to this Claude workspace but needs
  authorising: claude.ai → Settings → Connectors → HyperFrames by HeyGen → connect.
  Once authorised I can generate the pilot clips of the series directly from the
  scripts in `../33-THINGS.md`.
- **Higgsfield** — also connected here; same deal, I can run the explainer-video
  workflow against the 33-Things scripts and drop results into `07-AI-SERIES`.

Start with items №1 (write a will), №10 (guardians) and №33 (Estate Score) — the
three strongest hooks.

## Step 6 — Theme tune

Generate 3–5 candidates (Suno or a composer brief, spec in `../README.md` §8):
8–12s intro sting + the 3-note "Sor-ted" end sting. A/B them on the pilot clips
before committing. Buy out the master rights on the winner.

## Pilot week checklist

- [ ] 3 advisers picked, each given the Filming Guide + 3 scripts from `../SCRIPTS.md`
      (start with EP-01, the quarterly-meal flagship)
- [ ] 9 raw clips in `01-INBOX` → Scenario A fires → rows appear in the sheet
- [ ] Editor turns them round via the template ≤48h → `03-REVIEW` → approvals → post
- [ ] Post manually the first week; note per-channel timings for the Scenario C matrix
- [ ] Friday: review watch-through, pick the best clip, that's next week's paid test
