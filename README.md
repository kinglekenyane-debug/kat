# KAT · Keeping Attendance Today

Attendance registers for Ficksburg High School (Hoërskool Ficksburg): morning registers, period registers, absence reasons, cover, the office's SA-SAMS absentee list, records, printable monthly registers, incidents and book lists.

Developed by KK Lekenyane.

**Live test site:** https://kinglekenyane-debug.github.io/kat/

## Test version

All learners and marks are made up. Data is kept on each phone (browser storage) until the shared database is connected.

## How it is built

- `src/` holds the app: `core.js` (school settings, dates, sample data, data store), `tools.js` (Excel import, PDF and Excel reports), `timetable.js` (aSc timetable PDF reader), `ui.js` (screens), `style.css`, `index.html`.
- `assets/` holds the school crest and the KAT icon.
- `npm install && npm run build` writes the website into `docs/`, with every library copied locally so it works offline. GitHub Pages serves `docs/` from the `main` branch.
