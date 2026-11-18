/* ===== Timetable import (aSc Timetables PDF: one teacher per page) ===== */
const DAY_KEYS = { mo: 1, tu: 2, we: 3, th: 4, fr: 5, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5 };
function parseTimetablePage(items) {
  // items: [{s, x, y, h, w}] in PDF points, y grows upwards
  const it = items.map((i) => Object.assign({}, i, { s: i.s.trim() })).filter((i) => i.s);
  const titleI = it.filter((i) => /^(teacher|class|room)\s+\S/i.test(i.s)).sort((a, b) => b.h - a.h)[0];
  const title = titleI ? titleI.s : '';
  const kind = /^teacher/i.test(title) ? 'teacher' : /^class/i.test(title) ? 'class' : 'other';
  const name = title.replace(/^(teacher|class|room)\s+/i, '').trim();
  const days = it.filter((i) => DAY_KEYS[i.s.toLowerCase()] && i.h > 14).map((i) => ({ d: DAY_KEYS[i.s.toLowerCase()], y: i.y + i.h * 0.3 }));
  if (days.length < 3) return null;
  // header row: digits 1..N on one line, the highest such row
  const nums = it.filter((i) => /^\d{1,2}$/.test(i.s) && i.h > 10);
  const byY = {}; nums.forEach((i) => { const k = Math.round(i.y); (byY[k] = byY[k] || []).push(i); });
  const hy = Object.keys(byY).map(Number).filter((k) => byY[k].length >= 5).sort((a, b) => b - a)[0];
  if (hy === undefined) return null;
  const cols = byY[hy].map((i) => ({ p: Number(i.s), cx: i.x + i.w / 2 })).sort((a, b) => a.cx - b.cx);
  const brk = it.find((i) => /^break$/i.test(i.s) && Math.abs(i.y - hy) < 4);
  const times = it.filter((i) => /^\d{1,2}:\d\d\s*-\s*\d{1,2}:\d\d$/.test(i.s) && i.y < hy && i.y > hy - 30);
  const bells = cols.map((c) => { const t = times.sort((a, b) => Math.abs(a.x + a.w / 2 - c.cx) - Math.abs(b.x + b.w / 2 - c.cx))[0]; const m = t ? t.s.match(/(\d{1,2}:\d\d)\s*-\s*(\d{1,2}:\d\d)/) : null; return { p: c.p, t: m ? m[1].padStart(5, '0') : '', e: m ? m[2].padStart(5, '0') : '' }; });
  let brkTime = null;
  if (brk) { const t = times.find((x) => Math.abs(x.x + x.w / 2 - (brk.x + brk.w / 2)) < 25); if (t) { const m = t.s.match(/(\d{1,2}:\d\d)\s*-\s*(\d{1,2}:\d\d)/); brkTime = { t: m[1].padStart(5, '0'), e: m[2].padStart(5, '0'), after: cols.filter((c) => c.cx < brk.x).length }; } }
  const dayY = days.sort((a, b) => b.y - a.y);
  const rowOf = (y) => dayY.reduce((best, d) => (Math.abs(d.y - y) < Math.abs(best.y - y) ? d : best), dayY[0]);
  const big = it.filter((i) => i.y < hy - 20 && i.h >= 14 && !DAY_KEYS[i.s.toLowerCase()] && i !== titleI);
  const small = it.filter((i) => i.y < hy - 20 && i.h < 12 && !/generated|asc timetables/i.test(i.s));
  const lessons = [];
  big.forEach((c) => {
    const row = rowOf(c.y);
    const tops = small.filter((s) => s.y > c.y + 8 && s.y < c.y + c.h * 3.2 && rowOf(s.y) === row && s.x <= c.x + 3);
    const subj = tops.sort((a, b) => b.x - a.x)[0];
    const center = c.x + c.w / 2;
    const L = subj ? subj.x - 2 : center - 20;
    const R = 2 * center - L;
    const ps = cols.filter((k) => k.cx > L && k.cx < R).map((k) => k.p);
    if (!ps.length) return;
    lessons.push({ d: row.d, p: Math.min(...ps), len: ps.length, subject: subj ? subj.s : '', label: c.s.replace(/\s+/g, ' ') });
  });
  lessons.sort((a, b) => a.d - b.d || a.p - b.p);
  return { kind, name, bells, brk: brkTime, lessons };
}
async function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src)); document.head.appendChild(s); }); }
async function readPdfPages(buf) {
  if (!window.pdfjsLib) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js');
  }
  const pdf = await window.pdfjsLib.getDocument({ data: buf, isEvalSupported: false }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const pg = await pdf.getPage(n); const tc = await pg.getTextContent();
    pages.push(tc.items.map((i) => ({ s: i.str, x: i.transform[4], y: i.transform[5], h: Math.abs(i.transform[3]) || i.height, w: i.width })));
  }
  return pages;
}
async function parseTimetablePdf(buf) {
  const pages = await readPdfPages(buf);
  const out = pages.map(parseTimetablePage).filter((x) => x && x.lessons.length);
  return out;
}
function surnameKey(n) { return (n || '').toUpperCase().replace(/^(MR|MRS|MS|DR|MISS)\.?\s+/, '').replace(/[^A-Z ]/g, ' ').split(/\s+/).filter((w) => w.length > 1).sort((a, b) => b.length - a.length)[0] || ''; }
function matchStaff(db, ttName) {
  const t = (ttName || '').trim().toUpperCase();
  const bySym = db.staff.filter((s) => s.code && s.code.toUpperCase() === t); if (bySym.length === 1) return bySym[0]; // page headed with a symbol, e.g. "LK"
  const k = surnameKey(ttName); const hits = db.staff.filter((s) => surnameKey(s.name) === k || s.name.toUpperCase().split(/[\s.]+/).includes(k));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) { const g = symbolGuess(ttName); const h2 = hits.filter((s) => s.code === g); if (h2.length === 1) return h2[0]; }
  return null;
}
