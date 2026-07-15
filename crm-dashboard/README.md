# T&B CRM — "The Season" gamified sales dashboard (prototype)

**This is NOT part of the Calm & Contour website.** It is a self-contained prototype
of a gamified sales dashboard for the T&B CRM, parked in this repo on its own branch
so it has a home. It lives outside `app/` and `public/` on purpose — it does not
build into, deploy with, or appear on calmandcontour.com.

## What it is

A single file — `index.html` — with zero dependencies. Open it in any browser,
or hand it to the CRM developer as a working spec. Everything (styles, data,
game logic) is inline.

## The game

Everyone in the company is a piece on one championship race track. XP is computed
live from each person's real numbers (the formulas are printed on the page under
"How you score"), and their piece advances through Bronze → Silver → Gold → Platinum
gates toward the finish line. Leader wears the crown. Week / MTD / YTD toggle
re-runs the whole board.

Three squads, each scored on their own job:

- **Estate Planners** — dials made, appointments booked, appointments seen
  (funnel with conversion %), opportunities opened & won (count + £ value),
  exams passed, and pages read per book in the reading list.
- **Advisers** — reviews held, appointments, opportunity value, opportunities
  opened **by source** (reviews / new leads / estate-planner handovers / revived
  lost opps, each with count + £ value), and average task-resolution speed with
  a standing XP bonus for staying fast.
- **Membership Care** — average ticket-close speed (with speed bonus), tickets
  closed, and reviews scheduled (which feed the advisers' pipeline).

Plus: live activity ticker, podium for the top 3, earned badges (Rainmaker,
Scholar, Phone Warrior, Fastest Gun…), hover tooltips with each person's XP
breakdown, animated count-ups and piece movement (all disabled under
`prefers-reduced-motion`), and full light/dark themes.

## Wiring it to real data

All sample data sits in one block at the top of the `<script>` (`ROSTER`,
`TEAMS`, `BOOKS`, `EXAMS`, `SOURCES`, `PERIODS`). Replace `ROSTER` with an API
response of the same shape and the whole board — track, podium, cards, badges,
XP — recomputes itself. Gate thresholds and every XP rule are constants in
`xpBreakdown()` / `PERIODS`, so the game is tunable without touching the UI.

Chart colours are a CVD-validated categorical palette (checked with a palette
validator in both light and dark modes); the opportunity-source segments always
carry direct labels and a legend, so they stay readable for colour-blind users.
