/* ===== KAT tools: Excel class-list import, printable reports (PDF + Excel), saving files ===== */

/* ---- SA-SAMS / class-list import ---- */
function parseClassList(buf, filename) {
  const wb = XLSX.read(buf, { type: 'array' });
  let best = null;
  wb.SheetNames.forEach((sn) => {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, defval: '' });
    const res = parseRows(rows);
    if (res && (!best || res.learners.length > best.learners.length)) best = Object.assign(res, { sheet: sn });
  });
  if (!best) return { error: 'No class list found. KAT looks for a row with headings like "Acc No" and "Learner" or "Name".' };
  best.filename = filename;
  return best;
}
function parseRows(rows) {
  const s = (v) => String(v == null ? '' : v).trim();
  let h = -1, accCol = -1, nameCol = -1, genCol = -1;
  for (let i = 0; i < Math.min(rows.length, 40); i++) {
    const r = rows[i].map(s);
    const a = r.findIndex((c) => /^acc(\.|ession)?\s*(no|nr|number|#)?\.?$/i.test(c));
    const n = r.findIndex((c) => /^(learner|name|learner name|student|surname, name)$/i.test(c));
    if (a >= 0 && n >= 0) { h = i; accCol = a; nameCol = n; genCol = r.findIndex((c) => /^(gender|gen|sex|g)$/i.test(c)); break; }
  }
  if (h < 0) return null;
  // details from the top of the sheet
  const top = rows.slice(0, h).map((r) => r.map(s));
  const flat = top.map((r) => r.join(' ')).join('\n');
  const info = { subject: '', grade: '', cls: '', teacher: '' };
  const m1 = flat.match(/([A-Za-z][A-Za-z &]+?)\s*\(Gr\s*0?(\d{1,2})\)/);
  if (m1) { info.subject = m1[1].trim(); info.grade = String(Number(m1[2])); }
  const m2 = flat.match(/Class\s*:\s*([0-9]{1,2}\s*[A-Za-z]?)/);
  if (m2) info.cls = m2[1].replace(/\s+/g, '').toUpperCase();
  const after = (label) => { for (const r of top) { const i = r.findIndex((c) => new RegExp('^' + label + '\\s*:?$', 'i').test(c)); if (i >= 0) { const v = r.slice(i + 1).find((c) => c); if (v) return v; } } return ''; };
  info.subject = info.subject || after('Subject');
  info.teacher = after('Teacher') || after('Educator');
  const g = after('Grade'); if (g) { const mm = g.match(/(\d{1,2})\s*([A-Za-z])?/); if (mm) { info.grade = info.grade || String(Number(mm[1])); if (mm[2] && !info.cls) info.cls = mm[1] + mm[2].toUpperCase(); } }
  if (!info.cls && info.grade) { const mm = flat.match(new RegExp('\\b' + info.grade + '\\s*([A-E])\\b')); if (mm) info.cls = info.grade + mm[1]; }
  const learners = [], seen = new Set(); let skipped = 0, footer = 0;
  for (let i = h + 1; i < rows.length; i++) {
    const r = rows[i].map(s);
    if (/^(average|total|avg)/i.test(r[0] || '')) { footer++; continue; }
    const acc = (r[accCol] || '').replace(/\s/g, ''); const name = r[nameCol] || '';
    if (!/^\d{5,8}$/.test(acc) || name.indexOf(',') < 0) { if (acc || name) skipped++; continue; }
    if (seen.has(acc)) { footer++; continue; }
    seen.add(acc);
    const [sur, ...rest] = name.split(',');
    const gen = genCol >= 0 ? (r[genCol] || '').charAt(0).toUpperCase() : '';
    learners.push({ acc, surname: titleCase(sur.trim()), first: rest.join(',').trim(), gender: gen === 'F' || gen === 'M' ? gen : '' });
  }
  return Object.assign(info, { learners, skipped, footer, headerRow: h + 1 });
}
function titleCase(s) { return s.toLowerCase().replace(/(^|[\s-])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase()); }

/* ---- report models: one model drives both the on-screen paper preview, the PDF and Excel ---- */
const TICK = { tick: true, t: '✓' };
function markCell(m) { if (m === 'P') return TICK; if (m === 'A') return { t: 'A', cls: 'ab' }; if (m === 'L') return { t: 'L' }; return ''; }
function printedLine(app, school) { return 'Printed ' + fmtDMY(todayISO()) + ' ' + nowHM() + ' by ' + (app.me ? app.me.name : '') + ' from KAT, the ' + school.short + ' attendance app. Test version with sample learners.'; }

function morningRegisterModel(app, cls, y, m) {
  const db = app.db, school = app.school, N = daysInMonth(y, m), today = todayISO();
  const days = []; for (let d = 1; d <= N; d++) days.push(y + '-' + pad(m + 1) + '-' + pad(d));
  // learners who left during or after this month stay on it, with their archive date
  const accs = classLearners(db, cls).concat(sortAcc(db, Object.keys(db.learners).filter((a) => { const l = db.learners[a]; return l.archiveDate && (l.lastCls || l.cls) === cls && l.archiveDate >= days[0]; }))); const c = db.classes.find((x) => x.id === cls);
  const head = ['#', 'Accession No', 'Learner Name', 'Date of Birth', 'Date of Registration', 'Date of Archive', 'Gender'].concat(days.map((d) => parse(d).getDate() + '\n' + DOW[dow(d)].charAt(0)), ['Total']);
  const rowsAll = accs.map((acc, i) => {
    const l = db.learners[acc]; let tot = 0;
    const cells = days.map((d) => {
      if (!isSchoolDay(school, d)) return { t: '', cls: 'sh' };
      if (d > today || (l.archiveDate && d > l.archiveDate)) return '';
      const mm = morningMark(db, acc, d); if (mm === 'P' || mm === 'L') tot++; return markCell(mm);
    });
    return [String(i + 1), acc, { t: learnerName(l), align: 'l' }, fmtDMY(l.dob), fmtDMY(l.regDate), fmtDMY(l.archiveDate), l.gender].concat(cells, [String(tot)]);
  });
  const totals = ['', '', { t: 'Total present', align: 'l' }, '', '', '', ''].concat(days.map((d) => {
    if (!isSchoolDay(school, d)) return { t: '', cls: 'sh' };
    const r = db.registers[regKey('m', cls, d, 0)]; if (!r) return '';
    return String(accs.length - accs.filter((a) => r.marks[a] === 'A').length);
  }), ['']);
  const symOf = (id) => { const st = db.staff.find((x) => x.id === id); return st ? st.code || initials(st.name) : '?'; };
  const coverRow = ['', '', { t: 'Taken by (cover)', align: 'l' }, '', '', '', ''].concat(days.map((d) => { const r = db.registers[regKey('m', cls, d, 0)]; return r && r.by && c && r.by !== c.teacherId ? { t: symOf(r.by), cls: 'cv' } : ''; }), ['']);
  const anyCover = coverRow.some((x) => x && x.cls === 'cv');
  const pages = []; const per = 20;
  for (let i = 0; i < Math.max(1, rowsAll.length); i += per) {
    const last = i + per >= rowsAll.length;
    pages.push({
      title: [school.name.toUpperCase() + (school.local ? ' · ' + school.local.toUpperCase() : ''), 'LEARNER ATTENDANCE REGISTER'],
      meta: [['Month', MON_LONG[m] + ' ' + y], ['Class', cls], ['Register teacher', c ? staffName(db, c.teacherId) : ''], ['Learners', String(accs.length)]],
      head, body: rowsAll.slice(i, i + per), foot: last ? (anyCover ? [totals, coverRow] : [totals]) : null,
      widths: { 0: 6, 1: 15, 2: 40, 3: 15, 4: 15, 5: 13, 6: 9 },
      after: last ? signOff(db, c, y, m) : null,
      note: 'Key: ✓ present · A absent · L late · shaded = weekend or holiday · blank = not yet recorded' + (anyCover ? ' · a symbol at the bottom of a day = taken by that teacher (cover)' : '') + '. Learners ' + (i + 1) + ' to ' + Math.min(i + per, rowsAll.length) + ' of ' + rowsAll.length + '. ' + printedLine(app, school)
    });
  }
  return { orientation: 'l', pages, name: 'Register ' + cls + ' ' + MON[m] + ' ' + y, crest: school.crest };
}
function signOff(db, c, y, m) {
  const head = ['Designation', 'Name', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  // the weeks of this month, Monday to Friday, in order: Week 1 is the first week with a weekday in the month
  const weeks = []; if (y != null) for (let d = 1; d <= daysInMonth(y, m); d++) { const s = y + '-' + pad(m + 1) + '-' + pad(d); const w = dow(s); if (w >= 1 && w <= 5) { const ws = addDays(s, 1 - w); if (!weeks.includes(ws)) weeks.push(ws); } }
  const blank = 'Signature:\nDate:';
  const signedCell = (role, i) => { const x = weeks[i] && (db.signoffs || {})[role + '|' + weeks[i]]; if (!x) return blank; const p = db.staff.find((s) => s.id === x.by); return { t: 'Signed in KAT: ' + (p ? p.code || p.name : '') + '\nDate: ' + fmtDMY(x.at.slice(0, 10)), cls: 'cv' }; };
  const body = [['Class teacher', c ? staffName(db, c.teacherId) : '', null], ['SMT', '', null], ['Principal', '', 'principal'], ['District official', '', null]].map((r) => [{ t: r[0], align: 'l' }, { t: r[1], align: 'l' }].concat([0, 1, 2, 3, 4].map((i) => (r[2] ? signedCell(r[2], i) : blank))));
  return { head, body, tall: true };
}
function groupDayMark(db, g, acc, d) {
  const ps = g.slots.filter((s) => s.d === dow(d)).map((s) => periodMark(db, g, acc, d, s.p)).filter((x) => x);
  if (!ps.length) return null;
  if (ps.includes('A')) return 'A'; if (ps.includes('L')) return 'L'; return 'P';
}
function subjectRegisterModel(app, gid, y, m) {
  const db = app.db, school = app.school, g = db.groups.find((x) => x.id === gid), N = daysInMonth(y, m), today = todayISO();
  const days = []; for (let d = 1; d <= N; d++) days.push(y + '-' + pad(m + 1) + '-' + pad(d));
  const accs = sortAcc(db, g.learners);
  const head = ['ID', 'Gen', 'Acc nr', 'Name'].concat(days.map((d) => parse(d).getDate() + '\n' + DOW[dow(d)].slice(0, 2)), ['✓', 'A']);
  const lessonDay = (d) => g.slots.some((s) => s.d === dow(d));
  const body = accs.map((acc, i) => {
    const l = db.learners[acc]; let p = 0, a = 0;
    const cells = days.map((d) => {
      const w = dow(d); if (w === 0 || w === 6 || !isSchoolDay(school, d)) return { t: '', cls: 'sh' };
      if (!lessonDay(d)) return { t: '', cls: 'lt' };
      if (d > today) return '';
      const mm = groupDayMark(db, g, acc, d); if (mm === 'A') a++; else if (mm) p++; return markCell(mm);
    });
    return [String(i + 1), l.gender, acc, { t: learnerName(l), align: 'l' }].concat(cells, [String(p), String(a)]);
  });
  const symOf = (id) => { const st = db.staff.find((x) => x.id === id); return st ? st.code || initials(st.name) : '?'; };
  const cover = days.map((d) => { const by = [...new Set(g.slots.filter((s) => s.d === dow(d)).map((s) => db.registers[regKey('p', g.id, d, s.p)]).filter((r) => r && r.by && r.by !== g.teacherId).map((r) => symOf(r.by)))]; return by.length ? { t: by.join(' '), cls: 'cv' } : ''; });
  const anyCover = cover.some(Boolean);
  if (anyCover) body.push(['', '', '', { t: 'Taken by (cover)', align: 'l' }].concat(cover, ['', '']));
  const lessons = DOW.map((x, i) => g.slots.filter((s) => s.d === i).map((s) => pLabel(s.p, s.len || 1))).map((ps, i) => ps.length ? DOW[i] + ' ' + ps.join('+') : '').filter(Boolean).join(', ');
  const pages = []; const per = 30;
  for (let i = 0; i < Math.max(1, body.length); i += per) {
    pages.push({
      title: ['Monthly Class Attendance', school.name],
      meta: [['Teacher', staffName(db, g.teacherId)], ['Subject', g.subject], ['Month', MON_LONG[m]], ['Grade', g.label], ['Year', String(y)]],
      head, body: body.slice(i, i + per), widths: { 0: 7, 1: 8, 2: 15, 3: 44 },
      signLine: i + per >= body.length ? 'Educator: ______________________     Dept/Subject Head: ______________________     Date: ____________' : null,
      note: 'Key: ✓ present · A absent · L late (counted as present) · dark shading = weekend or holiday · light shading = no ' + g.subject + ' lesson that day.' + (anyCover ? ' A symbol in the last row = lesson taken by that teacher (cover).' : '') + ' Lessons: ' + lessons + '. Two lessons on one day show as the lower of the two marks. ' + printedLine(app, school)
    });
  }
  return { orientation: 'l', pages, name: g.short + ' ' + g.label + ' ' + MON[m] + ' ' + y, crest: school.crest };
}
function bookListModel(app, listId) {
  const db = app.db, school = app.school, b = db.books.find((x) => x.id === listId);
  const head = ['#', 'Name of learner', 'Book number', 'Sign for book (T1)', 'T2', 'T3', 'Return (T4)'];
  const seenCell = (v) => v === 'Y' ? TICK : v === 'M' ? { t: 'MISSING', cls: 'ab' } : '';
  const items = b.items.slice().sort((x, y2) => { const A = db.learners[x.acc], B = db.learners[y2.acc]; return (A.surname + A.first).localeCompare(B.surname + B.first); });
  const body = items.map((it, i) => [String(i + 1) + '.', { t: learnerName(db.learners[it.acc]), align: 'l' }, it.no || '', it.signed ? 'S ' + fmtDMY(it.signed).slice(0, 5) : '', seenCell(it.t2), seenCell(it.t3), it.returned ? 'R ' + fmtDMY(it.returned).slice(0, 5) : '']);
  const issued = b.items.filter((x) => x.signed).length, miss = b.items.filter((x) => x.t3 === 'M' || x.t2 === 'M').length;
  return {
    orientation: 'p', name: 'Book list ' + b.subject + ' Gr ' + b.grade,
    pages: [{ title: [school.name, 'BOOK LIST: ' + b.year], meta: [['Subject', b.subject], ['Grade', String(b.grade)], ['Teacher', staffName(db, b.teacherId)], ['Book', b.title || '']], head, body, widths: { 0: 9, 1: 58 },
      signLine: 'Teacher signature: ______________________',
      note: 'Key: S = signed for book in the app (date) · ✓ = book seen that term · MISSING = not seen · R = returned (date). ' + issued + ' books issued, ' + miss + ' missing. ' + printedLine(app, school) }]
  };
}
function incidentModel(app, list, title) {
  const db = app.db, school = app.school;
  const head = ['Date', 'Learner', 'Class', 'Type', 'What happened', 'Where', 'Logged by'];
  const body = list.map((x) => { const l = db.learners[x.acc]; return [fmtDMY(x.date), { t: learnerName(l), align: 'l' }, l ? (l.cls || '') : '', x.type + (x.detention ? '\n' + fmtDMY(x.detention.date) + ' ' + x.detention.time : ''), { t: x.note, align: 'l', wrap: true }, x.where || '', staffName(db, x.by)]; });
  return { orientation: 'l', name: title, pages: [{ title: [school.name, title.toUpperCase()], meta: [['Incidents', String(list.length)]], head, body, widths: { 0: 18, 1: 42, 2: 13, 3: 26, 4: 110, 5: 26 }, note: printedLine(app, school) }] };
}
function tableModel(app, title, meta, head, body, orientation, widths) {
  return { orientation: orientation || 'p', name: title, pages: [{ title: [app.school.name, title], meta, head, body, widths: widths || {}, note: printedLine(app, app.school) }] };
}

/* ---- PDF ---- */
function cellText(c) { return c == null ? '' : typeof c === 'string' ? c : c.t; }
function modelToPdf(model) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: model.orientation === 'l' ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const conv = (rows) => (rows || []).map((r) => r.map((c) => {
    if (c && c.tick || c === '✓') return { content: '', raw: TICK, styles: {} };
    const o = { content: cellText(c), raw: c, styles: {} };
    if (c && c.cls === 'sh') o.styles.fillColor = [205, 205, 205];
    if (c && c.cls === 'lt') o.styles.fillColor = [236, 236, 236];
    if (c && c.cls === 'ab') { o.styles.textColor = [176, 0, 32]; o.styles.fontStyle = 'bold'; }
    if (c && c.cls === 'cv') { o.styles.textColor = [18, 50, 154]; o.styles.fontStyle = 'bold'; o.styles.fontSize = 5.5; }
    if (c && c.align === 'l') o.styles.halign = 'left';
    return o;
  }));
  const drawTick = (data) => {
    const c = data.cell.raw && data.cell.raw.raw; if (!c || !c.tick) return;
    const x = data.cell.x + data.cell.width / 2, y = data.cell.y + data.cell.height / 2, s = Math.min(data.cell.width, data.cell.height) * 0.28;
    doc.setDrawColor(20, 20, 20); doc.setLineWidth(0.3);
    doc.line(x - s, y, x - s * 0.3, y + s * 0.8); doc.line(x - s * 0.3, y + s * 0.8, x + s, y - s * 0.9);
  };
  model.pages.forEach((pg, pi) => {
    if (pi > 0) doc.addPage();
    let y = 10;
    // the school crest at the top left of every page
    if (model.crest) { try { doc.addImage(model.crest, /^data:image\/png/.test(model.crest) ? 'PNG' : 'JPEG', 8, 4, 18, 18); } catch (e) { /* no crest */ } }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
    pg.title.forEach((t) => { doc.text(t, W / 2, y, { align: 'center' }); y += 5; });
    if (model.crest) y = Math.max(y, 24);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    let x = 10; pg.meta.forEach(([k, v]) => { doc.setFont('helvetica', 'bold'); doc.text(k + ':', x, y + 1); const kw = doc.getTextWidth(k + ': '); doc.setFont('helvetica', 'normal'); doc.text(v || '', x + kw, y + 1); x += kw + Math.max(doc.getTextWidth(v || '') + 10, 22); });
    y += 5;
    const many = pg.head.length > 20;
    const colStyles = {}; Object.keys(pg.widths || {}).forEach((k) => { colStyles[k] = { cellWidth: pg.widths[k] }; });
    doc.autoTable({
      startY: y, head: conv([pg.head]), body: conv(pg.body), foot: pg.foot ? conv(pg.foot) : undefined,
      theme: 'grid', margin: { left: 8, right: 8 }, showFoot: 'lastPage',
      styles: { fontSize: many ? 6.2 : 8.5, cellPadding: many ? 0.7 : 1.4, halign: 'center', valign: 'middle', lineColor: [90, 90, 90], lineWidth: 0.15, textColor: [0, 0, 0], overflow: 'linebreak' },
      headStyles: { fillColor: [235, 235, 235], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: many ? 5.8 : 8 },
      footStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: colStyles,
      didDrawCell: (d) => { drawTick(d); }
    });
    y = doc.lastAutoTable.finalY + 4;
    if (pg.after) {
      doc.autoTable({ startY: y, head: [pg.after.head], body: conv(pg.after.body), theme: 'grid', margin: { left: 8, right: 8 },
        styles: { fontSize: 7.5, cellPadding: 1.2, minCellHeight: pg.after.tall ? 9 : 0, lineColor: [90, 90, 90], lineWidth: 0.15, textColor: [0, 0, 0], valign: 'top' },
        headStyles: { fillColor: [235, 235, 235], textColor: [0, 0, 0] }, columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 45 } } });
      y = doc.lastAutoTable.finalY + 4;
    }
    if (pg.signLine) { doc.setFontSize(9); doc.text(pg.signLine, 10, y + 4); y += 8; }
    doc.setFontSize(7); doc.setTextColor(60); doc.text(doc.splitTextToSize((pg.note || '').replace(/✓/g, 'tick'), W - 20), 10, Math.min(y + 2, doc.internal.pageSize.getHeight() - 8)); doc.setTextColor(0);
  });
  return doc.output('arraybuffer');
}
function modelToXlsx(model) {
  const wb = XLSX.utils.book_new();
  const aoa = [];
  model.pages.forEach((pg, i) => {
    if (i === 0) { pg.title.forEach((t) => aoa.push([t])); aoa.push(pg.meta.map((x) => x.join(': '))); aoa.push([]); aoa.push(pg.head.map((h) => String(h).replace('\n', ' '))); }
    pg.body.forEach((r) => aoa.push(r.map(cellText)));
    if (pg.foot) pg.foot.forEach((r) => aoa.push(r.map(cellText)));
  });
  const last = model.pages[model.pages.length - 1];
  aoa.push([]); aoa.push([last.note]);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, 'KAT');
  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
}
function combine(models, name) { return { orientation: models[0].orientation, name, pages: [].concat(...models.map((m) => m.pages)) }; }

/* ---- saving a file: the claude.ai downloads capability in the test link, a normal download when hosted ---- */
let _dl;
async function saveFile(filename, data) {
  try {
    if (window.claude && typeof window.claude.use === 'function') {
      if (_dl === undefined) _dl = await window.claude.use('downloads');
      if (_dl) { await _dl.save({ filename, data }); return 'saved'; }
    }
  } catch (e) { if (e && e.code === 'declined') return 'declined'; return 'error:' + (e && (e.message || e.code)); }
  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  return 'saved';
}
const safeName = (s) => s.replace(/[^\w\- ]+/g, '').replace(/\s+/g, ' ').trim();
async function exportPdf(app, model) { const r = await saveFile(safeName(model.name) + '.pdf', modelToPdf(model)); if (r.startsWith('error')) app.toast('Could not make the PDF: ' + r.slice(6)); }
async function exportXlsx(app, model) { const r = await saveFile(safeName(model.name) + '.xlsx', modelToXlsx(model)); if (r.startsWith('error')) app.toast('Could not make the Excel file: ' + r.slice(6)); }
/* "Email me": on a phone the share sheet opens with the PDF attached (pick Gmail or Outlook);
   elsewhere the PDF is saved and a new email opens to the address in Settings, ready to attach it. */
const myEmail = () => LS.get('kat:email:' + (app.session && app.session.userId), '') || '';
async function emailPdf(app, model) {
  const name = safeName(model.name) + '.pdf';
  let file;
  try { file = new File([modelToPdf(model)], name, { type: 'application/pdf' }); } catch (e) { app.toast('Could not make the PDF: ' + (e.message || e)); return; }
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: model.name, text: model.name + ', sent from KAT' }); return; }
    catch (e) { if (e && e.name === 'AbortError') return; }
  }
  await saveFile(name, file);
  const to = myEmail();
  location.href = 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(model.name) + '&body=' + encodeURIComponent('The PDF "' + name + '" has been saved to your Downloads. Attach it to this email.');
  app.toast(to ? 'PDF saved. Your email opens next: attach the PDF.' : 'PDF saved. Your email opens next: attach the PDF. Add your email address in Settings to fill it in for you.');
}
