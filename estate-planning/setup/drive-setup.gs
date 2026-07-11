/**
 * CONTENT ENGINE — one-run Google Drive setup
 *
 * What it builds (idempotent — safe to run twice, it never duplicates):
 *  - The full folder tree inside the existing "Content Engine" folder
 *  - 12 estate-planner + 5 IFA upload folders inside 01-INBOX (rename to real names)
 *  - The "Content Sheet" master tracker with dropdowns for Status/Adviser/Type
 *  - The one-page "Filming Guide" doc in 00-BRIEFS
 *
 * How to run (2 minutes):
 *  1. Go to https://script.google.com (signed in as tamainriley@gmail.com)
 *  2. New project → delete the stub → paste this whole file → Save
 *  3. Run ▶ setupContentEngine → approve the permissions prompt → run again if it
 *     stopped for authorisation
 *  4. Open View → Logs for all the links. Done.
 */

// The "Content Engine" folder already created in the shared Drive setup:
const ROOT_ID = '1sE8SXHJvhYXZlAmj6JJhyQ7NQY4k4Js3';

const SUBFOLDERS = [
  '00-BRIEFS', '01-INBOX', '02-EDITING', '03-REVIEW',
  '04-APPROVED', '05-POSTED', '06-ASSETS', '07-AI-SERIES',
];

const SHEET_NAME = 'Content Sheet';
const STATUSES = ['RAW', 'EDITING', 'REVIEW', 'APPROVED', 'POSTED'];
const HEADERS = [
  'Date added', 'Adviser', 'Type', 'Script ref', 'Working title',
  'Raw file link', 'Status', 'Anonymised ✓', 'Compliance ✓ (IFA only)',
  'Hook line', 'Caption', 'Edited file link', 'Post date',
  'TikTok URL', 'Instagram URL', 'YouTube URL', 'Facebook URL', 'LinkedIn URL',
  'Views (7d)', 'Notes',
];

function setupContentEngine() {
  let root;
  try {
    root = DriveApp.getFolderById(ROOT_ID);
  } catch (e) {
    root = getOrCreateFolder_(DriveApp.getRootFolder(), 'Content Engine');
  }
  Logger.log('Root: %s', root.getUrl());

  const folders = {};
  SUBFOLDERS.forEach(function (name) {
    folders[name] = getOrCreateFolder_(root, name);
    Logger.log('%s: %s', name, folders[name].getUrl());
  });

  // Adviser upload folders — rename each to the real adviser's name in Drive.
  const advisers = [];
  for (let i = 1; i <= 12; i++) advisers.push('EP-' + pad_(i) + ' (rename to planner name)');
  for (let i = 1; i <= 5; i++) advisers.push('IFA-' + pad_(i) + ' (rename to IFA name)');
  advisers.forEach(function (name) {
    getOrCreateFolder_(folders['01-INBOX'], name);
  });
  Logger.log('Adviser folders in 01-INBOX: %s created/verified', advisers.length);

  const sheetFile = getOrCreateSheet_(root);
  Logger.log('Content Sheet: %s', sheetFile.getUrl());

  const guide = getOrCreateFilmingGuide_(folders['00-BRIEFS']);
  Logger.log('Filming Guide: %s', guide.getUrl());

  Logger.log('DONE. Next: share "Content Engine" with the 17 advisers (their own INBOX folder is enough) and the editor (whole tree).');
}

function getOrCreateFolder_(parent, name) {
  const existing = parent.getFoldersByName(name);
  return existing.hasNext() ? existing.next() : parent.createFolder(name);
}

function pad_(n) {
  return (n < 10 ? '0' : '') + n;
}

function getOrCreateSheet_(root) {
  const existing = root.getFilesByName(SHEET_NAME);
  if (existing.hasNext()) return existing.next();

  const ss = SpreadsheetApp.create(SHEET_NAME);
  const sheet = ss.getSheets()[0];
  sheet.setName('Tracker');
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);

  const rows = 1000;
  // Status dropdown (col G)
  sheet.getRange(2, 7, rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build()
  );
  // Type dropdown (col C)
  sheet.getRange(2, 3, rows).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['EP', 'IFA', 'AI'], true).build()
  );
  // Checkboxes for anonymisation + compliance (cols H, I)
  sheet.getRange(2, 8, rows, 2).insertCheckboxes();

  // Colour the status column by band so the pipeline reads at a glance.
  const gRange = 'G2:G' + (rows + 1);
  const colours = { RAW: '#f4cccc', EDITING: '#fce5cd', REVIEW: '#fff2cc', APPROVED: '#d9ead3', POSTED: '#cfe2f3' };
  const ruleBuilders = Object.keys(colours).map(function (status) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(status)
      .setBackground(colours[status])
      .setRanges([sheet.getRange(gRange)])
      .build();
  });
  sheet.setConditionalFormatRules(ruleBuilders);

  // Move the spreadsheet file into the Content Engine folder.
  const file = DriveApp.getFileById(ss.getId());
  file.moveTo(root);
  return file;
}

function getOrCreateFilmingGuide_(briefsFolder) {
  const NAME = 'FILMING GUIDE — one page, read before your first clip';
  const existing = briefsFolder.getFilesByName(NAME);
  if (existing.hasNext()) return existing.next();

  const doc = DocumentApp.create(NAME);
  const body = doc.getBody();
  body.appendParagraph('FILMING GUIDE').setHeading(DocumentApp.ParagraphHeading.HEADING1);

  body.appendParagraph('The setup').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  [
    'Your phone, VERTICAL (9:16). Front camera is fine.',
    'POV handheld at arm\'s length, or propped on your desk / dashboard.',
    'Face a window — light on your face, never behind you. No ring lights; slightly imperfect IS the style.',
    'Quiet room or parked car. Wired earphones mic if handy; phone mic is fine.',
    'Wear what you wore to the meeting. Real life, not an ad.',
  ].forEach(function (t) { body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET); });

  body.appendParagraph('The take').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  [
    'Read your script twice, then PUT IT DOWN. Talk it, don\'t read it — like a voice note to a friend.',
    'Look at the lens, not the screen.',
    'Leave 3 seconds of silence at the start and end.',
    'One or two takes max. Fluffed a line? Pause 2 seconds, say that sentence again — the editor cuts it.',
    'Always end with: "Another family, sorted."',
    '45–75 seconds. If you hit 2 minutes it\'s two stories — save one for next week.',
  ].forEach(function (t) { body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET); });

  body.appendParagraph('The rules that keep us out of trouble').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  [
    'No client names, no identifying details — blend the facts. If it could only be one client, it\'s not usable.',
    'No numbers as promises ("can often save tax", never "will save you £X").',
    'IFAs: your clip is a financial promotion — it will not post until compliance sign-off.',
  ].forEach(function (t) { body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET); });

  body.appendParagraph('The upload (2 minutes)').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  [
    'Open the shared Drive → 01-INBOX → your folder.',
    'Upload the video, named: YYYY-MM-DD_yourname_slug.mp4 (e.g. 2026-07-14_sarah_quarterly-meal.mp4).',
    'Fill your row in the Content Sheet: script ref, one-line summary, tick Anonymised (IFAs also tick Compliance when signed off).',
    'You\'ll get the finished edit to approve from your phone before anything posts.',
  ].forEach(function (t) { body.appendListItem(t).setGlyphType(DocumentApp.GlyphType.BULLET); });

  doc.saveAndClose();
  const file = DriveApp.getFileById(doc.getId());
  file.moveTo(briefsFolder);
  return file;
}
