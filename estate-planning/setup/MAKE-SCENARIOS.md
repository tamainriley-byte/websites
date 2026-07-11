# Make.com — the four scenarios, exact builds

Account: shannon@tab-legal.com (Make org already active). Each scenario below is a
10–15 minute build in the Make editor. Module names are exactly as they appear in
Make's module picker. All four use the same two connections: **Google Drive** and
**Google Sheets/Gmail** for the tamainriley@gmail.com Google account (create the
connection once in the first scenario, reuse it everywhere).

References you'll need:
- Content Engine folder: `https://drive.google.com/drive/folders/1sE8SXHJvhYXZlAmj6JJhyQ7NQY4k4Js3`
- The Content Sheet (created by `drive-setup.gs`), tab `Tracker`, columns A–T as
  laid out by the script (G = Status, H = Anonymised, I = Compliance).

---

## Scenario A — "Content Engine A: Intake" (build first)

Fires when an adviser drops a raw clip in their INBOX folder.

1. **Google Drive → Watch Files in a Folder**
   - Folder: `Content Engine / 01-INBOX`, ✅ *Watch subfolders* (so all 17 adviser
     folders are covered)
   - Watch: *By Created Time* · Limit: 10
2. **Google Sheets → Add a Row** (Content Sheet, tab `Tracker`)
   - Date added: `{{formatDate(1.createdTime; "DD/MM/YYYY")}}`
   - Adviser: `{{1.parentFolderName}}` *(if not available as an output, add a
     "Google Drive → Get a File/Folder" module before this to resolve the parent
     folder name)*
   - Type: `EP` default — or `{{if(contains(1.parentFolderName; "IFA"); "IFA"; "EP")}}`
   - Working title: `{{1.name}}`
   - Raw file link: `{{1.webViewLink}}`
   - Status: `RAW`
3. **Gmail → Send an Email**
   - To: content lead (set this to whoever runs editing; tamainriley@gmail.com for now)
   - Subject: `🎬 New raw clip: {{1.name}}`
   - Body: adviser folder name + link + "Edit within 48h. Template kit: 06-ASSETS."

Schedule: every 15 minutes. Turn ON.

## Scenario B — "Content Engine B: Review & Approve"

Two branches; one scenario with a Router, or two small scenarios if simpler.

**B1 — notify for approval.**
1. **Google Drive → Watch Files in a Folder** — `03-REVIEW`, by created time.
2. **Gmail → Send an Email** — to the adviser (lookup: add a small
   "advisers" tab to the Content Sheet mapping folder name → email, and use
   **Google Sheets → Search Rows** to fetch it).
   - Subject: `👀 Your clip is ready — approve to post: {{1.name}}`
   - Body: view link + "Reply APPROVED, or click: {{webhook URL from B2}}&file={{1.id}}"
   - IFA clips (filter on file/folder name containing `IFA`): CC compliance,
     subject prefix `[COMPLIANCE] `.

**B2 — the approve click.**
1. **Webhooks → Custom Webhook** (name: `content-approve`) — Make gives you a URL;
   paste it into B1's email body.
2. **Google Drive → Move a File/Folder** — file ID `{{1.file}}` → destination `04-APPROVED`.
3. **Google Sheets → Update a Row** — find the row by Raw file link (Search Rows on
   the file ID first), set Status = `APPROVED`.
4. **Webhook Response** — body: `Approved ✅ — it'll go out on schedule. Another family, sorted.`

## Scenario C — "Content Engine C: Publish"

Until the scheduler account exists (see SETUP.md — Metricool or Blotato), this
scenario stages and notifies; swap module 3 for the scheduler's API call later.

1. **Google Drive → Watch Files in a Folder** — `04-APPROVED`.
2. **Google Sheets → Search Rows** — match the file, pull Caption + Hook line.
3. **Gmail → Send an Email** — to whoever posts, subject `🚀 Ready to post: {{1.name}}`,
   body: download link + caption text ready to paste per channel.
   - *Later:* replace with **HTTP → Make a Request** to the Metricool/Blotato API
     (multi-profile post: TikTok, Reels, Shorts, Facebook), staggered 30–60 min
     per channel.
4. **Google Drive → Move a File/Folder** — → `05-POSTED`.
5. **Google Sheets → Update a Row** — Status = `POSTED`, Post date = today.

## Scenario D — "Content Engine D: Weekly report"

1. **Schedule** the scenario itself: Fridays 16:00 (Europe/London).
2. **Google Sheets → Search Rows** — rows where `Date added` ≥ 7 days ago.
3. **Tools → Text Aggregator** — build the digest: clips in per adviser (17
   expected — name the missing), clips posted, clips stuck in RAW/REVIEW > 48h.
4. **Gmail → Send an Email** — to Shannon + owner:
   subject `📊 Content Engine week: {{in}} in / {{posted}} posted`.
   - Views/engagement stay manual until the scheduler API is connected — its
     analytics endpoint slots in here as an HTTP module later.

---

## Order of switch-on

1. Run `drive-setup.gs` first (folders + sheet must exist).
2. Scenario A on day one — it's pure upside, no risk.
3. B after the first pilot clips flow (needs the advisers tab filled with emails).
4. C in staged mode (email) immediately; API mode once the scheduler is chosen.
5. D after two weeks of data.

Total Make operations at full volume (~25 clips/week): well inside the free/Core tier.
