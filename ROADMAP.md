# Calm & Contour — Product Roadmap

Vision captured 9 July 2026. Build order and tech notes for the developer.

## The vision

A booking + payment platform for VIP mobile massage. Clients chat to an AI that talks like a therapist, book and pay in-app, extend or reschedule themselves, and come back through a loyalty/referral programme. Therapists ("the team") set their own availability via their Google Calendar; the app books them in. Proven in Mallorca, then rolled out city by city.

## Conversion insight (already learned)

Search-ad leads are high-intent and convert well (Parissa's estimate: 50–60%+). Demand Gen / "dynamic" leads are low-intent (the ones who hung up). Keep spend on Search, keep Demand Gen paused.

## Phase 1 — Lead capture (LIVE)

- AI chat on-site, speaks as Parissa, gathers details + address, books provisionally, saves to `/admin`.
- Owner alert when a number is captured (moving to a weekly email digest instead of instant pings).
- **Add now:** a "booked" toggle in `/admin` so leads can be marked confirmed → unlocks true cost-per-booking in the weekly report (~1 hr of work).

## Phase 2 — Booking management

- Confirmed date + time on every booking, with client self-reschedule (they like to move date/time — make it one tap, not a phone call).
- Special requests field (pressure, focus areas, allergies, oils, music).
- A short "what happens in your massage" explainer shown before/after booking (sets expectations, reduces no-shows).
- Therapist availability via Google Calendar (Google Calendar API — free at this scale). Each therapist connects her Google account once (OAuth); the app reads free/busy and writes the booking to her calendar.

## Phase 3 — Payments (Stripe)

- Stripe integration for card capture and charging. **IMPORTANT: never store raw card numbers.** Use Stripe's SetupIntent / Payment Element / Checkout so the card is vaulted by Stripe and the app only holds a customer token. This keeps it PCI-compliant.
- VIP member = card on file. Add card once, then future bookings and changes are frictionless.
- In-app extensions: agree 60 → 90 min (or add-ons) in the chat/app, price adjusts automatically and charges the saved card.
- Optional: deposit at booking to cut no-shows.

## Phase 4 — Post-massage & retention

- Feedback after each massage: how they feel, what they liked, what they want more / less of. Store against the client profile so the next therapist tailors it.
- Re-book in one tap ("reserve another massage") from the feedback screen.

## Phase 5 — Referral & loyalty

- Partner referral programme. Refer friends; track referrals against the client.
- VIP Gold tier: refer 3+ people to unlock cancellation priority and late-evening slots (Gold-only inventory).

## Phase 6 — Marketplace & scale

- Multi-therapist marketplace: onboarding, vetting, availability, payouts (Stripe Connect for paying therapists / taking your cut, e.g. ~€35 a booking).
- Multi-city rollout: same playbook per market — local Search ads + locally recruited, vetted therapists. The gating metric is the same everywhere: keep cost-per-booking below your cut.

## Cross-cutting notes for the developer

- **Payments:** Stripe only; never store PANs. Stripe Connect if you're splitting money with therapists.
- **Google Calendar:** free API; OAuth per therapist. Note Google app-verification is needed once you have many external users, but not at small scale.
- **Data / GDPR:** you're storing personal data and massage preferences (some of it health-adjacent). You need a privacy policy, explicit consent at signup, and a way to delete a client's data on request.
- **Notifications:** replace CallMeBot (unreliable, free) with email digests now, and a proper transactional email/WhatsApp provider later for booking confirmations and reminders.
- **Economics gate:** every phase is worth building only while cost-per-booking stays comfortably under your ~€35 margin. That number, tracked weekly, decides when to add therapists, raise spend, and open a new city.
