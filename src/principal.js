/* ================= principal and deputies: the whole school at a glance ================= */
// Monday of the week that holds date s
function weekStart(s) { const w = dow(s); return addDays(s, w === 0 ? -6 : 1 - w); }
// morning-register attendance for a set of classes over some days: present (incl. late) / recorded
function attendance(db, classIds, days) {
  let rec = 0, abs = 0, late = 0, taken = 0, due = 0;
  classIds.forEach((c) => { const n = classLearners(db, c).length; days.forEach((d) => { due++; const r = db.registers[regKey('m', c, d, 0)]; if (!r) return; taken++; rec += n; Object.values(r.marks).forEach((m) => { if (m === 'A') abs++; if (m === 'L') late++; }); }); });
  return { pct: rec ? (100 * (rec - abs)) / rec : null, abs, late, taken, due };
}
function Bar({ pct, low }) {
  const v = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  return html`<span class="pbar"><i style=${'width:' + v + '%;background:' + (pct != null && pct < low ? 'var(--red)' : 'var(--primary)')}></i></span>`;
}
function PrincipalHome({ nav }) {
  const db = app.db, s = app.school, me = app.me, today = todayISO();
  const hour = new Date().getHours(); const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const isDay = isSchoolDay(s, today);
  const classIds = db.classes.map((c) => c.id);
  const now = attendance(db, classIds, isDay ? [today] : []);
  const got = isDay ? db.classes.filter((c) => db.registers[regKey('m', c.id, today, 0)]).length : 0;
  const enrolled = Object.values(db.learners).filter((l) => !l.archiveDate && l.cls).length;

  // the last four school weeks, per grade
  const weeks = []; let ws = weekStart(today);
  for (let i = 0; i < 4; i++) { const days = schoolDays(s, ws, addDays(ws, 4)).filter((d) => d <= today); weeks.unshift({ ws, days }); ws = addDays(ws, -7); }
  const gradeRows = s.grades.map((g) => ({ g, cells: weeks.map((w) => attendance(db, db.classes.filter((c) => c.grade === g).map((c) => c.id), w.days).pct) }));
  const schoolRow = weeks.map((w) => attendance(db, classIds, w.days).pct);
  const fmtPct = (p) => (p == null ? '–' : p.toFixed(1) + '%');

  // what needs the principal's attention
  const staffToday = db.staff.map((p) => ({ p, ch: (db.changes || {})[p.id + '|' + today] || {} })).filter((x) => x.ch.absent || x.ch.signout);
  const covers = Object.values(db.registers).filter((r) => r.date === today && r.coverFor);
  const owing = useMemo(() => db.staff.filter((p) => p.role === 'teacher').map((p) => ({ p, n: missedFor(db, s, p.id, today, 10).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n), [db.registers, db.changes]);
  const old = prevSchoolDays(s, today, 4)[3] || today;
  const noReason = Object.keys(db.reasons).filter((k) => { const d = k.split('|')[1]; return !db.reasons[k].code && d <= old; });
  const noReasonByClass = {}; noReason.forEach((k) => { const l = db.learners[k.split('|')[0]]; const c = (l && (l.cls || l.lastCls)) || '?'; noReasonByClass[c] = (noReasonByClass[c] || 0) + 1; });
  const term = cal(s).terms.find((t) => today >= t.from && today <= t.to) || cal(s).terms.filter((t) => t.from <= today).slice(-1)[0];
  const termDays = term ? schoolDays(s, term.from, today < term.to ? today : term.to) : [];
  const chronic = useMemo(() => Object.values(db.learners).filter((l) => !l.archiveDate && l.cls).map((l) => { let n = 0, a = 0; termDays.forEach((d) => { const m = morningMark(db, l.acc, d); if (m) { n++; if (m === 'A') a++; } }); return { l, n, a, pct: n ? (100 * (n - a)) / n : 100 }; }).filter((x) => x.n >= 5 && x.pct < 90).sort((x, y) => x.pct - y.pct), [db.registers, today]);
  const inARow = useMemo(() => Object.keys(db.learners).map((a) => ({ a, n: consecutiveAbsent(db, s, a, today) })).filter((x) => x.n >= 3).sort((x, y) => y.n - x.n), [db.registers, today]);
  const wkFrom = weekStart(today); const incidents = db.incidents.filter((x) => x.date >= wkFrom);
  const incTypes = {}; incidents.forEach((x) => { incTypes[x.type] = (incTypes[x.type] || 0) + 1; });

  // weekly sign-off: the principal signs the previous week
  const lastWs = addDays(weekStart(today), -7), lastDays = schoolDays(s, lastWs, addDays(lastWs, 4));
  const lastWeek = attendance(db, classIds, lastDays);
  const signed = app.signoff('principal', lastWs);
  const [showChronic, setShowChronic] = useState(false);
  const sign = () => { app.signWeek('principal', lastWs); app.toast('Week of ' + fmtShort(lastWs) + ' signed off. It shows on the printed registers.'); };
  const reportModel = () => tableModel(app, 'WHOLE SCHOOL ATTENDANCE · LAST 4 WEEKS', [['Printed for', me.name], ['Weeks from', fmtDMY(weeks[0].ws)]], ['Grade'].concat(weeks.map((w) => 'Week of ' + fmtDMY(w.ws))), gradeRows.map((r) => ['Grade ' + r.g].concat(r.cells.map(fmtPct))).concat([['Whole school'].concat(schoolRow.map(fmtPct))]), 'p');

  return html`<div class="app">
    <header class="band home-band"><div class="wide gut band-in">
      <div class="row"><div class="crestbox"><img src=${s.crest} alt=${s.name + ' crest'} /></div>
        <div class="grow"><div style="font-size:20px;font-weight:800">${hello}, ${me.short || me.name}</div><div class="tiny" style="opacity:.9">${me.title} · ${s.name} · ${fmtLong(today)}</div></div><${Logo} s=${34} /></div></div></header>
    <main class="wide gut content">
      <section class="kpis">
        <div class="kpi"><div class="l">Attendance today</div><div class="v">${isDay ? fmtPct(now.pct) : '–'}</div><div class="s muted">${isDay ? now.abs + ' absent · ' + now.late + ' late · ' + enrolled + ' enrolled' : 'Not a school day'}</div></div>
        <div class="kpi"><div class="l">Morning registers in</div><div class="v">${got} <small>of ${db.classes.length}</small></div><div class="s" style=${got < db.classes.length && isDay ? 'color:var(--abs-ink)' : 'color:var(--ok-fg)'}>${isDay ? (db.classes.length - got ? db.classes.length - got + ' still to come' : 'All in') : 'None needed'}</div></div>
        <div class="kpi"><div class="l">This term</div><div class="v">${fmtPct(attendance(db, classIds, termDays).pct)}</div><div class="s muted">${term ? 'Term ' + term.n + ' · ' + termDays.length + ' school days so far' : ''}</div></div>
        <div class="kpi"><div class="l">Staff away today</div><div class="v">${staffToday.length}</div><div class="s muted">${covers.length} register${covers.length === 1 ? '' : 's'} taken by cover</div></div>
      </section>
      <div class="split">
        <section class="card mainpane"><div class="between"><h2 style="font-size:17px">Attendance by grade · last 4 weeks</h2><button class="btn sm line" onClick=${() => exportPdf(app, reportModel())}><${Icon} n="print" s=${16} />Print</button></div>
          <span class="tiny muted">Morning register. Red bars are below 90%.</span>
          <div class="tablebox"><table class="t"><thead><tr><th>Grade</th>${weeks.map((w) => html`<th>Week of ${fmtShort(w.ws).replace(/^\w+ /, '')}</th>`)}</tr></thead><tbody>
            ${gradeRows.map((r) => html`<tr><td><b>Grade ${r.g}</b></td>${r.cells.map((p) => html`<td><div class="pcell"><${Bar} pct=${p} low=${90} /><span>${fmtPct(p)}</span></div></td>`)}</tr>`)}
            <tr style="font-weight:700"><td>Whole school</td>${schoolRow.map((p) => html`<td>${fmtPct(p)}</td>`)}</tr></tbody></table></div>
          <div class="wrap"><button class="btn line" onClick=${() => nav.go('office')}><${Icon} n="grid" s=${18} />Today's registers, class by class</button><button class="btn line" onClick=${() => nav.go('records')}><${Icon} n="file" s=${18} />Find records</button></div>
        </section>
        <aside class="sidepane">
          <section class="card" style=${signed ? '' : 'border-left:4px solid var(--accent)'}><h2 style="font-size:16px">Weekly sign-off</h2>
            <span class="small">Week of ${fmtShort(lastWs)}: ${lastWeek.taken} of ${lastWeek.due} morning registers taken · ${fmtPct(lastWeek.pct)} attendance.</span>
            ${signed ? html`<div class="boxnote ok"><span>Signed by ${staffName(db, signed.by)} on ${fmtShort(signed.at.slice(0, 10))} at ${signed.at.slice(11, 16)}.</span></div>`
              : html`<span class="tiny muted">Due ${DOW_LONG[schoolTimes(s).signoff.principal.d]} ${schoolTimes(s).signoff.principal.t}. Your signature shows in the Principal row of every printed register for that week.</span><button class="btn" onClick=${sign}>Sign off the week of ${fmtShort(lastWs)}</button>`}</section>
          <section class="card"><h2 style="font-size:16px">Needs attention</h2>
            ${isDay && got < db.classes.length && html`<button class="list-row" onClick=${() => nav.go('office')}><span class="grow"><b>${db.classes.length - got} morning register${db.classes.length - got === 1 ? '' : 's'} not in yet</b><br /><span class="tiny muted">${db.classes.filter((c) => !db.registers[regKey('m', c.id, today, 0)]).map((c) => c.id).join(', ')}</span></span><${Icon} n="chev" s=${18} /></button>`}
            ${owing.length > 0 && html`<div class="stack"><span class="eyebrow">Registers owed · last 10 school days</span>${owing.slice(0, 6).map((x) => html`<div class="between small"><span>${x.p.code ? x.p.code + ' · ' : ''}${x.p.name}</span><b style="color:var(--abs-ink)">${x.n}</b></div>`)}${owing.length > 6 && html`<span class="tiny muted">and ${owing.length - 6} more teachers</span>`}</div>`}
            ${noReason.length > 0 && html`<div class="stack"><span class="eyebrow">Absences with no reason after 3 days · ${noReason.length}</span><span class="small">${Object.entries(noReasonByClass).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => c + ' (' + n + ')').join(', ')}</span><span class="tiny muted">The circuit manager asks for a reason for every absence.</span></div>`}
            ${inARow.length > 0 && html`<div class="stack"><span class="eyebrow">Absent 3+ days in a row · ${inARow.length}</span>${inARow.slice(0, 5).map((x) => { const l = db.learners[x.a]; return html`<button class="between linkbtn" style="color:var(--fg);font-weight:400;width:100%" onClick=${() => nav.go('learner', { acc: x.a })}><span>${learnerShort(l)} · ${l.cls}</span><b style="color:var(--abs-ink)">${x.n} days</b></button>`; })}</div>`}
            ${!owing.length && !noReason.length && !inARow.length && !(isDay && got < db.classes.length) && html`<span class="small muted">Nothing needs attention right now.</span>`}
          </section>
          <section class="card"><h2 style="font-size:16px">Below 90% this term · ${chronic.length} learners</h2>
            ${chronic.slice(0, showChronic ? 40 : 5).map((x) => html`<button class="between linkbtn" style="color:var(--fg);font-weight:400;width:100%" onClick=${() => nav.go('learner', { acc: x.l.acc })}><span>${learnerShort(x.l)} · ${x.l.cls}</span><b style="color:var(--abs-ink)">${x.pct.toFixed(0)}% · ${x.a} days</b></button>`)}
            ${chronic.length > 5 && html`<button class="linkbtn" onClick=${() => setShowChronic(!showChronic)}>${showChronic ? 'Show fewer' : 'Show all ' + chronic.length}</button>`}
            ${!chronic.length && html`<span class="small muted">Everyone is at 90% or above.</span>`}</section>
          <section class="card"><h2 style="font-size:16px">Staff today</h2>
            ${staffToday.length === 0 && html`<span class="small muted">Nobody is marked absent or signed out.</span>`}
            ${staffToday.map((x) => html`<div class="between small"><span>${x.p.code ? x.p.code + ' · ' : ''}${x.p.name}</span><span class="pill ${x.ch.absent ? 'red' : 'grey'}">${x.ch.absent ? 'Absent' : 'Signed out ' + x.ch.signout}</span></div>`)}
            ${covers.length > 0 && html`<span class="tiny muted">Cover today: ${covers.map((r) => staffSym(db, r.by) + ' for ' + staffSym(db, r.coverFor)).join(', ')}</span>`}</section>
          <section class="card"><h2 style="font-size:16px">Incidents this week · ${incidents.length}</h2>
            ${incidents.length ? html`<span class="small">${Object.entries(incTypes).map(([t, n]) => t + ' ' + n).join(' · ')}</span>` : html`<span class="small muted">None logged this week.</span>`}
            <button class="btn line" onClick=${() => nav.go('incidents')}>Open the incident log</button></section>
        </aside>
      </div>
    </main><${BottomNav} nav=${nav} cur="principal" /></div>`;
}
